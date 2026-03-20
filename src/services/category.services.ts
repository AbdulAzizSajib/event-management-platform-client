'use server';

import { httpClient } from '@/lib/axios/httpClient';
import type { Category } from '@/types';

export const getAllCategories = async () => {
    return httpClient.get<Category[]>('/categories');
};
