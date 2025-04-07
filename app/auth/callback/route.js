// app/auth/callback/route.js
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function GET(req) {
	const requestUrl = new URL(req.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		const cookieStore = await cookies(); // ✅ await required here
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		await supabase.auth.exchangeCodeForSession(code);
	}

	return NextResponse.redirect(new URL('/', requestUrl)); // or your dashboard
}
