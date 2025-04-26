import { NextResponse } from 'next/server';
import { generateUsername } from '@/lib/usernameUtils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Secret that should match what you set in the Supabase Dashboard
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

// This is a secure webhook that should be called by Supabase
// The Supabase auth webhook should be configured in the Supabase dashboard
// with the correct secret key
export async function POST(request) {
	try {
		// Verify the webhook request is legitimate
		const webhookSecret = request.headers.get('x-webhook-secret');
		if (WEBHOOK_SECRET && webhookSecret !== WEBHOOK_SECRET) {
			console.error('Webhook secret mismatch');
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const requestData = await request.json();
		console.log('Webhook received:', requestData.type);

		// Validate webhook signature if needed
		// Verify if this is from Supabase (you should implement proper validation)
		// const signature = request.headers.get('x-signature');
		// if (!validateSignature(signature)) {
		//   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
		// }

		// Currently processing only user creation events
		if (requestData.type === 'USER_CREATED') {
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
						status: 'User already has username',
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
				// Update existing user
				await prisma.user.update({
					where: { id: user.id },
					data: {
						username,
						// If no name is set, use the part before @ in email
						name: existingUser.name || name,
					},
				});
				console.log(
					`Updated existing user ${user.id} with username ${username}`
				);
			} else {
				// Create new user
				await prisma.user.create({
					data: {
						id: user.id,
						email: user.email,
						username,
						name: name,
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
