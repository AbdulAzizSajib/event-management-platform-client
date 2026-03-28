"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!BASE_API_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        // Skip refresh if either token is missing — Google login users may not have refreshToken,
        // and some flows may not have session token
        if (!sessionToken || !refreshToken) {
            return false;
        }

        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error: unknown) {
        // Silently ignore cookie modification errors during page render
        const msg = error instanceof Error ? error.message : '';
        if (!msg.includes('Cookies can only be modified')) {
            console.error("Error refreshing token:", error);
        }
        return false;
    }
}

export async function forgetPassword(email: string) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/forget-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Failed to send OTP" };
        }

        return { success: true, message: data.message || "OTP sent to your email" };
    } catch {
        return { success: false, message: "Something went wrong" };
    }
}

export async function resetPassword(payload: { email: string; otp: string; newPassword: string }) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Failed to reset password" };
        }

        return { success: true, message: data.message || "Password reset successfully" };
    } catch {
        return { success: false, message: "Something went wrong" };
    }
}

export async function getUserInfo() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}
