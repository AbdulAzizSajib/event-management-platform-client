'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { Category } from '@/types';

export interface CategoryWithCount extends Category {
    _count?: {
        events: number;
    };
}

export interface CreateCategoryPayload {
    name: string;
    icon?: string;
}

export interface UpdateCategoryPayload {
    name?: string;
    icon?: string;
}

export const getAllCategories = async (params?: Record<string, unknown>) => {
    return httpClient.get<CategoryWithCount[]>('/categories', { params });
};

export const createCategory = async (data: CreateCategoryPayload) => {
    return httpClient.post<CategoryWithCount>('/categories', data);
};

export const updateCategory = async (id: string, data: UpdateCategoryPayload) => {
    return httpClient.patch<CategoryWithCount>(`/categories/${id}`, data);
};

export const deleteCategory = async (id: string) => {
    return httpClient.delete(`/categories/${id}`);
};
