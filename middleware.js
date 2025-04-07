import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	await supabase.auth.getSession(); // ensures the cookie is read and set

	return res;
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
