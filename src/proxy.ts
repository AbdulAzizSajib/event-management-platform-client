import { NextRequest, NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, type UserRole } from './lib/authUtils';
import { jwtUtils } from './lib/jwtUtils';
import { isTokenExpiringSoon } from './lib/tokenUtils';
import { getNewTokensWithRefreshToken } from './services/auth.services';

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken);
        return !!refresh;
    } catch (error) {
        console.error('Error refreshing token in middleware:', error);
        return false;
    }
}

export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const accessToken = request.cookies.get('accessToken')?.value;
        const refreshToken = request.cookies.get('refreshToken')?.value;

        const decodedAccessToken =
            accessToken &&
            jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

        const isValidAccessToken =
            accessToken &&
            jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

        let userRole: UserRole | null = null;

        if (decodedAccessToken) {
            userRole = decodedAccessToken.role as UserRole;
        }

        const routeOwner = getRouteOwner(pathname);
        const isAuth = isAuthRoute(pathname);

        // Proactively refresh token if about to expire
        if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken))) {
            const requestHeaders = new Headers(request.headers);

            try {
                const refreshed = await refreshTokenMiddleware(refreshToken);
                if (refreshed) {
                    requestHeaders.set('x-token-refreshed', '1');
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }

            return NextResponse.next({
                request: { headers: requestHeaders },
            });
        }

        // Rule 1: Logged-in user trying to access auth route → redirect to dashboard
        if (isAuth && isValidAccessToken) {
            return NextResponse.redirect(
                new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
            );
        }

        // Rule 2: Public route → allow
        if (routeOwner === null) {
            return NextResponse.next();
        }

        // Rule 3: Not logged in but trying to access protected route → redirect to signin
        if (!accessToken || !isValidAccessToken) {
            const signinUrl = new URL('/signin', request.url);
            signinUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(signinUrl);
        }

        // Rule 4: Common protected route → allow
        if (routeOwner === 'COMMON') {
            return NextResponse.next();
        }

        // Rule 5: Role-based route but user doesn't have required role → redirect to their dashboard
        if (routeOwner !== userRole) {
            return NextResponse.redirect(
                new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
            );
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error in proxy middleware:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};
