'use server';

import { setTokenInCookies } from '@/lib/tokenUtils';

interface GoogleAuthTokens {
    accessToken: string;
    refreshToken: string;
    sessionToken?: string | null;
}

export async function setGoogleAuthCookies(tokens: GoogleAuthTokens) {
    try {
        await setTokenInCookies('accessToken', tokens.accessToken);
        await setTokenInCookies('refreshToken', tokens.refreshToken);

        if (tokens.sessionToken) {
            await setTokenInCookies('better-auth.session_token', tokens.sessionToken, 24 * 60 * 60);
        }

        return { success: true };
    } catch {
        return { success: false };
    }
}
