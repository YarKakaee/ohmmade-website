import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function POST(request) {
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	try {
		const { email, password } = await request.json();

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError) {
			return NextResponse.json(
				{ error: authError.message },
				{ status: 400 }
			);
		}

		const adminData = await prisma.admin.findFirst({
			where: {
				email: authData.user.email,
				isActive: true,
			},
		});

		if (!adminData) {
			await supabase.auth.signOut();
			return NextResponse.json(
				{
					error: 'Access denied. Only admin users can access this area.',
				},
				{ status: 403 }
			);
		}

		try {
			await prisma.admin.update({
				where: { id: adminData.id },
				data: { lastLoginAt: new Date() },
			});
		} catch (updateError) {
			// Silently fail - not critical
		}

		try {
			await prisma.adminActionLog.create({
				data: {
					adminId: adminData.id,
					action: 'ADMIN_LOGIN',
					resourceType: 'System',
					details: {
						loginMethod: 'email',
						timestamp: new Date().toISOString(),
					},
				},
			});
		} catch (logError) {
			// Silently fail - not critical
		}

		return NextResponse.json({
			success: true,
			user: authData.user,
			admin: adminData,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
