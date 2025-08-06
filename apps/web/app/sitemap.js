import getPrismaClient from '@/prisma/client';

export default async function sitemap() {
	const prisma = getPrismaClient();
	const baseUrl = 'https://ohmmade.ca';

	// Get all published projects
	const projects = await prisma.project.findMany({
		where: { status: 'published' },
		select: { slug: true, updatedAt: true },
	});

	// Get all users with projects
	const users = await prisma.user.findMany({
		where: {
			projects: {
				some: {
					status: 'published',
				},
			},
		},
		select: { username: true, updatedAt: true },
	});

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/manifesto`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/education`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/legal/privacy`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/legal/terms`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
	];

	// Project pages
	const projectPages = projects.map((project) => ({
		url: `${baseUrl}/projects/${project.slug}`,
		lastModified: project.updatedAt,
		changeFrequency: 'weekly',
		priority: 0.8,
	}));

	// User profile pages
	const userPages = users.map((user) => ({
		url: `${baseUrl}/u/${user.username}`,
		lastModified: user.updatedAt,
		changeFrequency: 'weekly',
		priority: 0.7,
	}));

	return [...staticPages, ...projectPages, ...userPages];
}
