import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import prisma from '@/prisma/client';

export async function GET(req) {
	try {
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
		const limit = parseInt(searchParams.get('limit') || '10');

		const activities = await prisma.userActivity.findMany({
			where: {
				userId: session.user.id,
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

		return new Response(JSON.stringify(activities), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error fetching activities:', error);
		return new Response('Error fetching activities', { status: 500 });
	}
}
