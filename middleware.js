// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });
	await supabase.auth.getSession(); // This refreshes the session if needed
	return res;
}

export const config = {
	matcher: ['/projects/publish'], // Protect this route
};
