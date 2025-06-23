// /app/api/projects/create/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createActivity } from '@/lib/activity';
import { generateUsername } from '@/lib/usernameUtils';
import { awardWatts } from '@/lib/watts';

export async function POST(req) {
	try {
		const body = await req.json();

		let username = body.username;
		if (!username) {
			username = await generateUsername(
				body.name || body.email.split('@')[0]
			);
		}

		// Upsert the user — creates if not exists
		await prisma.user.upsert({
			where: { email: body.email },
			update: {},
			create: {
				id: body.userId,
				name: body.name || null,
				email: body.email || null,
				username,
			},
		});

		// Fetch the user to get the correct id
		const user = await prisma.user.findUnique({
			where: { email: body.email },
		});

		// Create the project and connect the author
		const newProject = await prisma.project.create({
			data: {
				title: body.title,
				description: body.description,
				category: body.category,
				difficultyLevel: body.difficultyLevel,
				timeToBuild: body.timeToBuild,
				tags: body.tags,
				componentsUsed: body.componentsUsed,
				content: body.content,
				thumbnailUrl: body.thumbnailUrl,
				slug: body.slug,
				status: body.status || 'published',
				views: 0,
				likes: 0,
				author: {
					connect: { id: user.id },
				},
			},
		});

		// Track publishing activity if the project is published
		if (newProject.status === 'published') {
			await createActivity(
				body.userId,
				'PROJECT_PUBLISHED',
				newProject.id
			);

			// Award watts for publishing a project
			try {
				await awardWatts(user.id, 100, 'Published a project', prisma);
			} catch (error) {
				console.error(
					'Error awarding watts for project publication:',
					error
				);
			}
		}

		return NextResponse.json(
			{ success: true, project: newProject },
			{ status: 201 }
		);
	} catch (err) {
		console.error('Failed to create project:', err);
		return NextResponse.json(
			{ error: 'Failed to create project' },
			{ status: 500 }
		);
	}
}
