import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit')) || 50;

		const activities = await prisma.adminActionLog.findMany({
			take: limit,
			orderBy: { createdAt: 'desc' },
			include: {
				admin: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			activities,
		});
	} catch (error) {
		console.error('Error fetching admin activities:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch admin activities' },
			{ status: 500 }
		);
	}
}
