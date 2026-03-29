'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { MessageCircle, Send, Loader2, ArrowLeft, User, CalendarDays } from 'lucide-react';
import {
    getMyConversations,
    getConversationMessages,
    sendMessageRest,
    markMessagesRead,
    type ChatMessage,
    type Conversation,
} from '@/services/chat.services';
import { getAccessToken } from '@/lib/getAccessToken';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';

interface MessagesTabProps {
    userId: string;
}

export default function MessagesTab({ userId }: MessagesTabProps) {
    const currentUserId = userId;

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [typing, setTyping] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const notifSocketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial load with loading spinner
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyConversations({ limit: 50 });
            setConversations(res.data);
        } catch {
            setConversations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Silent refresh — no loading state, just update data
    const refreshConversations = useCallback(async () => {
        try {
            const res = await getMyConversations({ limit: 50 });
            setConversations(res.data);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Global notification socket — silently refresh list
    useEffect(() => {
        let cancelled = false;

        getAccessToken().then((token) => {
            if (cancelled) return;

            const socket = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                auth: { token },
            });

            notifSocketRef.current = socket;

            socket.on('connect_error', (err) => {
                console.error('[Messages] Notification socket error:', err.message);
            });

            socket.on('message-notification', () => {
                refreshConversations();
            });
        });

        return () => {
            cancelled = true;
            notifSocketRef.current?.disconnect();
            notifSocketRef.current = null;
        };
    }, [refreshConversations]);

    // Get the other person in the conversation
    const getOtherPerson = useCallback((convo: Conversation) => {
        // If current user is the organizer, show the user. Otherwise show the organizer.
        if (convo.organizerId === currentUserId) {
            return convo.user;
        }
        return convo.organizer;
    }, [currentUserId]);

    const getLastMessage = (convo: Conversation) => {
        if (!convo.messages || convo.messages.length === 0) return null;
        return convo.messages[convo.messages.length - 1];
    };

    const getUnreadCount = (convo: Conversation) => {
        return convo._count?.messages ?? 0;
    };

    const openConversation = async (convo: Conversation) => {
        setActiveConvo(convo);
        setMessagesLoading(true);
        setMessages([]);
        setInput('');
        setTyping(false);
        try {
            const res = await getConversationMessages(convo.id, { limit: 50 });
            // API returns newest first — reverse for chronological display
            setMessages([...res.data].reverse());

            // Mark as read
            await markMessagesRead(convo.id).catch(() => {});
            // Clear unread count locally
            setConversations((prev) =>
                prev.map((c) => (c.id === convo.id ? { ...c, _count: { messages: 0 } } : c))
            );
        } catch {
            // silent
        } finally {
            setMessagesLoading(false);
        }
    };

    // Socket for active conversation
    useEffect(() => {
        if (!activeConvo) return;

        let cancelled = false;

        getAccessToken().then((token) => {
            if (cancelled) return;

            const socket = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                auth: { token },
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                socket.emit('join-conversation', activeConvo.id);
            });

            socket.on('connect_error', (err) => {
                console.error('[Messages] Socket error:', err.message);
            });

            socket.on('new-message', (message: ChatMessage) => {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === message.id)) return prev;
                    const hasTemp = prev.some((m) => m.id.startsWith('temp-') && m.senderId === message.senderId);
                    if (hasTemp) {
                        let replaced = false;
                        return prev.map((m) => {
                            if (!replaced && m.id.startsWith('temp-') && m.senderId === message.senderId) {
                                replaced = true;
                                return message;
                            }
                            return m;
                        });
                    }
                    return [...prev, message];
                });
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === activeConvo.id
                            ? { ...c, messages: [message], updatedAt: message.createdAt }
                            : c
                    )
                );
                socket.emit('mark-read', activeConvo.id);
            });

            socket.on('user-typing', (data: { conversationId: string; userId: string }) => {
                if (data.conversationId === activeConvo.id && data.userId !== currentUserId) {
                    setTyping(true);
                }
            });

            socket.on('stop-typing', () => {
                setTyping(false);
            });

            socket.on('messages-read', () => {
                // Could update read receipts UI here
            });
        });

        return () => {
            cancelled = true;
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [activeConvo, currentUserId]);

    const handleSend = async () => {
        const content = input.trim();
        if (!content || !activeConvo || sending) return;

        setSending(true);
        setInput('');

        // Optimistic: show message instantly
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: ChatMessage = {
            id: tempId,
            conversationId: activeConvo.id,
            senderId: currentUserId,
            content,
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: { id: currentUserId, name: 'You', image: null },
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        const socket = socketRef.current;

        try {
            if (socket?.connected) {
                socket.emit('send-message', {
                    conversationId: activeConvo.id,
                    content,
                });
                socket.emit('stop-typing', activeConvo.id);
            } else {
                const res = await sendMessageRest(activeConvo.id, content);
                setMessages((prev) =>
                    prev.map((m) => (m.id === tempId ? res.data : m))
                );
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === activeConvo.id
                            ? { ...c, messages: [res.data], updatedAt: res.data.createdAt }
                            : c
                    )
                );
            }
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            setInput(content);
        } finally {
            setSending(false);
        }
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        const socket = socketRef.current;
        if (!socket?.connected || !activeConvo) return;

        socket.emit('typing', activeConvo.id);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', activeConvo.id);
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const goBack = () => {
        setActiveConvo(null);
        setMessages([]);
        setTyping(false);
        refreshConversations();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div>
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageCircle className="mb-3 size-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                    <p className="mt-1 text-xs text-gray-400">
                        Messages about your events will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Messages ({conversations.length})
            </h2>

            <div className="flex h-[620px] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                {/* Left — Conversation List */}
                <div
                    className={`w-full shrink-0 overflow-y-auto border-r border-gray-200 sm:w-80 dark:border-gray-800 ${
                        activeConvo ? 'hidden sm:block' : ''
                    }`}
                >
                    {conversations.map((convo) => {
                        const other = getOtherPerson(convo);
                        const lastMsg = getLastMessage(convo);
                        const unread = getUnreadCount(convo);
                        const isActive = activeConvo?.id === convo.id;

                        return (
                            <button
                                key={convo.id}
                                onClick={() => openConversation(convo)}
                                className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition dark:border-gray-800 ${
                                    isActive
                                        ? 'bg-blue-50 dark:bg-blue-950/50'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    {other.image ? (
                                        <img src={other.image} alt={other.name} className="size-11 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex size-11 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                            <User className="size-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}
                                    {unread > 0 && (
                                        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                            {unread > 9 ? '9+' : unread}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm ${unread > 0 ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-800 dark:text-gray-200'}`}>
                                            {other.name}
                                        </p>
                                        {lastMsg && (
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(lastMsg.createdAt).toLocaleDateString([], {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    {convo.event && (
                                        <p className="flex items-center gap-1 text-[11px] text-gray-400">
                                            <CalendarDays className="size-2.5" />
                                            {convo.event.title}
                                        </p>
                                    )}
                                    {lastMsg ? (
                                        <p className={`mt-0.5 truncate text-xs ${unread > 0 ? 'font-medium text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {lastMsg.senderId === currentUserId ? 'You: ' : ''}
                                            {lastMsg.content}
                                        </p>
                                    ) : (
                                        <p className="mt-0.5 text-xs text-gray-400">No messages yet</p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right — Chat Area */}
                <div
                    className={`flex min-w-0 flex-1 flex-col ${
                        !activeConvo ? 'hidden sm:flex' : 'flex'
                    }`}
                >
                    {activeConvo ? (
                        <>
                            {/* Chat Header */}
                            {(() => {
                                const other = getOtherPerson(activeConvo);
                                return (
                                    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                                        <button
                                            onClick={goBack}
                                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 sm:hidden dark:hover:bg-gray-800"
                                        >
                                            <ArrowLeft className="size-4" />
                                        </button>
                                        {other.image ? (
                                            <img src={other.image} alt={other.name} className="size-9 rounded-full object-cover" />
                                        ) : (
                                            <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                                <User className="size-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{other.name}</p>
                                            {typing ? (
                                                <p className="text-xs text-blue-500">typing...</p>
                                            ) : activeConvo.event ? (
                                                <p className="truncate text-xs text-gray-400">{activeConvo.event.title}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-3">
                                {messagesLoading ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Loader2 className="size-6 animate-spin text-blue-500" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <MessageCircle className="mb-2 size-10 text-gray-300 dark:text-gray-600" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {messages.map((msg) => {
                                            const isOwn = msg.senderId === currentUserId;
                                            const other = getOtherPerson(activeConvo);
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                                                >
                                                    {!isOwn && (
                                                        other.image ? (
                                                            <img src={other.image} alt={other.name} className="size-7 shrink-0 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                                                <User className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                        )
                                                    )}
                                                    <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                                                        <div
                                                            className={`inline-block rounded-2xl px-3.5 py-2 text-sm text-left ${
                                                                isOwn
                                                                    ? 'btn text-white rounded-br-md'
                                                                    : 'bg-gray-100 text-gray-800 rounded-bl-md dark:bg-gray-800 dark:text-gray-200'
                                                            }`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                        <p className={`mt-0.5 text-[10px] text-gray-400 ${isOwn ? 'text-right' : ''}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || sending}
                                        className="flex size-10 shrink-0 items-center justify-center rounded-xl btn text-white transition hover:opacity-90 disabled:opacity-50"
                                    >
                                        {sending ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Send className="size-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center px-8">
                            <div className="flex size-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                                <MessageCircle className="size-8 text-blue-500" />
                            </div>
                            <p className="mt-4 font-medium text-gray-700 dark:text-gray-300">Select a conversation</p>
                            <p className="mt-1 text-sm text-gray-400">
                                Choose a conversation from the left to start chatting.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
