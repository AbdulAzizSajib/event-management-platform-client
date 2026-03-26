'use server';

import { httpClient } from '@/lib/axios/httpClient';

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        image: string | null;
    };
}

export interface Conversation {
    id: string;
    eventId: string;
    userId: string;
    organizerId: string;
    createdAt: string;
    updatedAt: string;
    event: {
        id: string;
        title: string;
        image?: string | null;
    };
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    organizer: {
        id: string;
        name: string;
        image: string | null;
    };
    messages: ChatMessage[];
    _count: {
        messages: number;
    };
}

export const createConversation = async (eventId: string) => {
    return httpClient.post<Conversation>('/chat/conversations', { eventId });
};

export const getMyConversations = async (params?: Record<string, unknown>) => {
    return httpClient.get<Conversation[]>('/chat/conversations', { params });
};

export const getConversationMessages = async (
    conversationId: string,
    params?: Record<string, unknown>
) => {
    return httpClient.get<ChatMessage[]>(
        `/chat/conversations/${conversationId}/messages`,
        { params }
    );
};

export const sendMessageRest = async (conversationId: string, content: string) => {
    return httpClient.post<ChatMessage>(
        `/chat/conversations/${conversationId}/messages`,
        { content }
    );
};

export const markMessagesRead = async (conversationId: string) => {
    return httpClient.patch(`/chat/conversations/${conversationId}/read`, {});
};
