import { NextResponse } from 'next/server';
import { generateUsername } from '@/lib/usernameUtils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamic import to avoid build-time analysis
const getPrisma = async () => {
	try {
		const { default: prisma } = await import('@/prisma/client');
		return prisma;
	} catch (error) {
		// During build time, return a mock client
		return {
			user: {
				findUnique: async () => null,
				create: async () => ({ id: 'mock' }),
				update: async () => ({ id: 'mock' }),
			},
		};
	}
};

export async function POST(request) {
	try {
		const prisma = await getPrisma();

		const requestData = await request.json();
		console.log('Webhook received:', requestData.type);

		// Handle both USER_CREATED and SIGNED_IN events
		if (
			requestData.type === 'USER_CREATED' ||
			requestData.type === 'SIGNED_IN'
		) {
			const user = requestData.record;

			if (!user || !user.id) {
				return NextResponse.json(
					{ error: 'Invalid user data' },
					{ status: 400 }
				);
			}

			// Check if a user record already exists
			const existingUser = await prisma.user.findUnique({
				where: { id: user.id },
			});

			if (existingUser) {
				// User already exists in our database, check if they have a username
				if (existingUser.username) {
					return NextResponse.json({
						status: 'User already exists',
					});
				}
			}

			// Extract name from user metadata or email
			const name =
				user.raw_user_meta_data?.name ||
				user.user_metadata?.name ||
				user.raw_user_meta_data?.full_name ||
				user.raw_user_meta_data?.preferred_username ||
				user.email.split('@')[0];

			// Generate a unique username
			const username = await generateUsername(name);
			console.log(`Generated username "${username}" for user ${user.id}`);

			// Create or update user with username
			if (existingUser) {
				// Do nothing, just return
				console.log(
					`User ${user.id} already exists, not updating any fields.`
				);
			} else {
				// Create new user
				await prisma.user.create({
					data: {
						id: user.id,
						email: user.email,
						username,
						name: name,
						image: user.user_metadata?.avatar_url,
						createdAt: new Date(user.created_at),
					},
				});
				console.log(
					`Created new user ${user.id} with username ${username}`
				);
			}

			return NextResponse.json({
				status: 'success',
				username,
			});
		}

		// For other webhook events, just acknowledge
		return NextResponse.json({
			status: 'acknowledged',
			event: requestData.type,
		});
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
