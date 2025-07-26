import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		// Get all users with their project counts
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				username: true,
				image: true,
				bio: true,
				watts: true,
				level: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						projects: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json({
			success: true,
			users,
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		);
	}
}
