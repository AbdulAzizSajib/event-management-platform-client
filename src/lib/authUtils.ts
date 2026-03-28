export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';

export const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email'];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
};

export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
    exact: ['/my-profile', '/change-password'],
    pattern: [],
};

export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin/],
    exact: [],
};

export const userProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: [],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): 'ADMIN' | 'USER' | 'COMMON' | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return 'ADMIN';
    }

    if (isRouteMatches(pathname, userProtectedRoutes)) {
        return 'USER';
    }

    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return 'COMMON';
    }

    return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        return '/admin/dashboard';
    }
    return '/';
};

export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === 'COMMON') {
        return true;
    }

    return routeOwner === role;
};
