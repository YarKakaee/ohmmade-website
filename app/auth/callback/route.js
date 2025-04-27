// app/auth/callback/route.js
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateUsername } from '@/lib/usernameUtils';

const prisma = new PrismaClient();

export async function GET(req) {
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
			// Check if user exists in Prisma
			const existingUser = await prisma.user.findUnique({
				where: { id: session.user.id },
			});

			if (!existingUser) {
				// Extract name from user metadata or email
				const name =
					session.user.user_metadata?.name ||
					session.user.user_metadata?.full_name ||
					session.user.email.split('@')[0];

				// Generate a unique username
				const username = await generateUsername(name);

				// Create new user in Prisma
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
			}
		}
	}

	return NextResponse.redirect(new URL('/', requestUrl));
}
