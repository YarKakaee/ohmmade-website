import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		const admins = await prisma.admin.findMany({
			where: {
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
				lastLoginAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json({
			success: true,
			admins,
		});
	} catch (error) {
		console.error('Error fetching admins:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch admins' },
			{ status: 500 }
		);
	}
}
