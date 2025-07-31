// app/auth/callback/route.js
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import getPrismaClient from '@/prisma/client';
import { generateUsername } from '@/lib/usernameUtils';

// Force dynamic rendering to prevent prerendering
export const dynamic = 'force-dynamic';

export async function GET(req) {
	const prisma = await getPrismaClient();
	const requestUrl = new URL(req.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
			error,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error('Error exchanging code for session:', error);
			return NextResponse.redirect(
				new URL('/signin?error=auth', requestUrl)
			);
		}

		if (session?.user) {
			// Check if user exists in Prisma by email
			const existingUser = await prisma.user.findUnique({
				where: { email: session.user.email },
			});

			if (!existingUser) {
				// User does not exist, create with generated username
				const name =
					session.user.user_metadata?.name ||
					session.user.user_metadata?.full_name ||
					session.user.email.split('@')[0];
				const username = await generateUsername(name);

				await prisma.user.create({
					data: {
						id: session.user.id,
						email: session.user.email,
						username,
						name: name,
						image: session.user.user_metadata?.avatar_url,
						createdAt: new Date(),
					},
				});
				console.log(
					`Created new user ${session.user.id} with username ${username}`
				);
			} else {
				// User exists, update other fields but DO NOT overwrite username or createdAt
				await prisma.user.update({
					where: { email: session.user.email },
					data: {
						id: session.user.id,
					},
				});
			}
		}
	}

	return NextResponse.redirect(new URL('/', requestUrl));
}
