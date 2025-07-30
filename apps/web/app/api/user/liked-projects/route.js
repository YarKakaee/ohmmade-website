import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import getPrismaClient from '@/prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req) {
	try {
		const prisma = getPrismaClient();
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		// Get user session from Supabase
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const searchParams = new URL(req.url).searchParams;
		const userId = searchParams.get('userId');
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = 6; // 6 items per page
		const skip = (page - 1) * limit;

		if (!userId) {
			return new Response('User ID is required', { status: 400 });
		}

		const [projects, total] = await Promise.all([
			prisma.project.findMany({
				where: {
					userLikes: {
						some: {
							userId: userId,
						},
					},
				},
				include: {
					author: {
						select: {
							name: true,
							image: true,
							email: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
				skip,
				take: limit,
			}),
			prisma.project.count({
				where: {
					userLikes: {
						some: {
							userId: userId,
						},
					},
				},
			}),
		]);

		return new Response(JSON.stringify({ projects, total }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error fetching liked projects:', error);
		return new Response('Error fetching liked projects', { status: 500 });
	}
}
