import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const days = parseInt(searchParams.get('days')) || 7;

		// Calculate the date from which to count activities
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		// Get count of activities in the specified time period
		const recentActivitiesCount = await prisma.userActivity.count({
			where: {
				createdAt: {
					gte: startDate,
				},
			},
		});

		return NextResponse.json({
			success: true,
			count: recentActivitiesCount,
			period: `${days} days`,
		});
	} catch (error) {
		console.error('Error fetching recent activities count:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch recent activities count' },
			{ status: 500 }
		);
	}
}
