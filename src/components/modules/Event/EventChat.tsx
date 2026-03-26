'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { MessageCircle, Send, Loader2, X, User } from 'lucide-react';
import {
    createConversation,
    getConversationMessages,
    sendMessageRest,
    markMessagesRead,
    type ChatMessage,
    type Conversation,
} from '@/services/chat.services';

interface EventChatProps {
    eventId: string;
    userId: string;
    organizerName: string;
    organizerImage: string | null;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export default function EventChat({ eventId, userId, organizerName, organizerImage }: EventChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [typing, setTyping] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initChat = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await createConversation(eventId);
            setConversation(res.data);

            const msgRes = await getConversationMessages(res.data.id, { limit: 50 });
            setMessages([...msgRes.data].reverse());

            await markMessagesRead(res.data.id).catch(() => {});
        } catch {
            setError('Failed to start conversation. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    // Socket connection — withCredentials lets browser send httpOnly cookies automatically
    useEffect(() => {
        if (!isOpen || !conversation) return;

        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join-conversation', conversation.id);
        });

        socket.on('connect_error', (err) => {
            console.error('[Chat] Socket connect_error:', err.message);
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
            socket.emit('mark-read', conversation.id);
        });

        socket.on('user-typing', (data: { conversationId: string; userId: string }) => {
            if (data.conversationId === conversation.id && data.userId !== userId) {
                setTyping(true);
            }
        });

        socket.on('stop-typing', () => {
            setTyping(false);
        });

        socket.on('error', (data: { message: string }) => {
            console.error('[Chat] Socket error:', data.message);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isOpen, conversation, userId]);

    const handleOpen = async () => {
        setIsOpen(true);
        if (!conversation) {
            await initChat();
        }
    };

    const handleSend = async () => {
        const content = input.trim();
        if (!content || !conversation || sending) return;

        setSending(true);
        setInput('');

        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: ChatMessage = {
            id: tempId,
            conversationId: conversation.id,
            senderId: userId,
            content,
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: { id: userId, name: 'You', image: null },
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        const socket = socketRef.current;

        try {
            if (socket?.connected) {
                socket.emit('send-message', {
                    conversationId: conversation.id,
                    content,
                });
                socket.emit('stop-typing', conversation.id);
            } else {
                const res = await sendMessageRest(conversation.id, content);
                setMessages((prev) =>
                    prev.map((m) => (m.id === tempId ? res.data : m))
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
        if (!socket?.connected || !conversation) return;

        socket.emit('typing', conversation.id);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', conversation.id);
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full btn px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-90 active:scale-95"
            >
                <MessageCircle className="size-5" />
                <span className="hidden sm:inline">Chat with Organizer</span>
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] max-sm:left-4 max-sm:right-4 max-sm:w-auto flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            {organizerImage ? (
                                <img src={organizerImage} alt={organizerName} className="size-9 rounded-full object-cover" />
                            ) : (
                                <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                    <User className="size-4 text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{organizerName}</p>
                                {typing ? (
                                    <p className="text-xs text-blue-500">typing...</p>
                                ) : (
                                    <p className="text-xs text-gray-400">Event Organizer</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="size-6 animate-spin text-blue-500" />
                            </div>
                        ) : error ? (
                            <div className="flex h-full flex-col items-center justify-center text-center px-4">
                                <MessageCircle className="mb-3 size-10 text-gray-300 dark:text-gray-600" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                                <button
                                    onClick={initChat}
                                    className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center px-4">
                                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                                    <MessageCircle className="size-7 text-blue-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ask {organizerName} anything
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Event details, schedule, venue info — feel free to ask!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg) => {
                                    const isOwn = msg.senderId === userId;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                                        >
                                            {!isOwn && (
                                                organizerImage ? (
                                                    <img src={organizerImage} alt={organizerName} className="size-7 shrink-0 rounded-full object-cover" />
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

                    {!error && (
                        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Message ${organizerName}...`}
                                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
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
                    )}
                </div>
            )}
        </>
    );
}
