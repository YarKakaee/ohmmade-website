import getPrismaClient from '@/prisma/client';

export async function createActivity(userId, type, projectId = null) {
	const prisma = getPrismaClient();
	try {
		const activity = await prisma.userActivity.create({
			data: {
				userId,
				type,
				projectId,
			},
			include: {
				project: {
					select: {
						title: true,
						slug: true,
					},
				},
			},
		});
		return activity;
	} catch (error) {
		console.error('Error creating activity:', error);
		return null;
	}
}

export async function getUserActivities(userId, limit = 10) {
	const prisma = getPrismaClient();
	try {
		const activities = await prisma.userActivity.findMany({
			where: {
				userId,
			},
			include: {
				project: {
					select: {
						title: true,
						slug: true,
						thumbnailUrl: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
		});
		return activities;
	} catch (error) {
		console.error('Error fetching user activities:', error);
		return [];
	}
}

export function formatActivityMessage(activity) {
	const messages = {
		PROJECT_PUBLISHED: 'Published a new project',
		PROJECT_LIKED: 'Liked a project',
		PROJECT_SAVED: 'Saved a project',
		PROJECT_VIEWED: 'Viewed a project',
	};

	const action = messages[activity.type];
	if (!action) return '';

	if (activity.project) {
		return `${action}`;
	}

	return action;
}
