import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Protected routes
	const protectedRoutes = ['/user', '/projects/publish'];

	// Check if the current path starts with any protected route
	const isProtectedRoute = protectedRoutes.some((route) =>
		req.nextUrl.pathname.startsWith(route)
	);

	// If there is no session and the user is trying to access a protected route
	if (!session && isProtectedRoute) {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = '/signin';
		redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
		return NextResponse.redirect(redirectUrl);
	}

	return res;
}

export const config = {
	matcher: ['/user/:path*', '/projects/publish/:path*'],
};
