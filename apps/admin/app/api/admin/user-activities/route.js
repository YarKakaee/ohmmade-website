import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 20;
		const search = searchParams.get('search') || '';
		const filter = searchParams.get('filter') || 'all';
		const sortBy = searchParams.get('sortBy') || 'createdAt';
		const sortOrder = searchParams.get('sortOrder') || 'desc';

		const skip = (page - 1) * limit;

		// Build where clause for filtering
		let whereClause = {};

		// Search functionality
		if (search) {
			whereClause.OR = [
				{
					user: {
						name: {
							contains: search,
							mode: 'insensitive',
						},
					},
				},
				{
					user: {
						username: {
							contains: search,
							mode: 'insensitive',
						},
					},
				},
				{
					user: {
						email: {
							contains: search,
							mode: 'insensitive',
						},
					},
				},
				{
					project: {
						title: {
							contains: search,
							mode: 'insensitive',
						},
					},
				},
			];
		}

		// Filter by activity type
		if (filter !== 'all') {
			whereClause.type = filter;
		}

		// Get total count for pagination
		const totalCount = await prisma.userActivity.count({
			where: whereClause,
		});

		// Handle sorting for user name
		let orderByClause = {};
		if (sortBy === 'user.name') {
			orderByClause = {
				user: {
					name: sortOrder,
				},
			};
		} else {
			orderByClause = {
				[sortBy]: sortOrder,
			};
		}

		// Get activities with user and project details
		const activities = await prisma.userActivity.findMany({
			where: whereClause,
			take: limit,
			skip: skip,
			orderBy: orderByClause,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						email: true,
						image: true,
					},
				},
				project: {
					select: {
						id: true,
						title: true,
						slug: true,
						thumbnailUrl: true,
					},
				},
			},
		});

		// Format activities for display
		const formattedActivities = activities.map((activity) => ({
			id: activity.id,
			type: activity.type,
			createdAt: activity.createdAt,
			user: activity.user,
			project: activity.project,
			description: formatActivityDescription(activity),
		}));

		return NextResponse.json({
			success: true,
			activities: formattedActivities,
			pagination: {
				page,
				limit,
				totalCount,
				totalPages: Math.ceil(totalCount / limit),
				hasNext: page < Math.ceil(totalCount / limit),
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error('Error fetching user activities:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user activities' },
			{ status: 500 }
		);
	}
}

// Helper function to format activity descriptions
function formatActivityDescription(activity) {
	const userName =
		activity.user?.name || activity.user?.username || 'Unknown User';
	const projectTitle = activity.project?.title || 'Unknown Project';

	switch (activity.type) {
		case 'PROJECT_PUBLISHED':
			return `${userName} published a new project: "${projectTitle}"`;
		case 'PROJECT_LIKED':
			return `${userName} liked the project: "${projectTitle}"`;
		case 'PROJECT_SAVED':
			return `${userName} saved the project: "${projectTitle}"`;
		case 'PROJECT_VIEWED':
			return `${userName} viewed the project: "${projectTitle}"`;
		default:
			return `${userName} performed an action`;
	}
}
