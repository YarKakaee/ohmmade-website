import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import prisma from '@/prisma/client';

export async function DELETE(req) {
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

		// Delete user from database
		await prisma.user.delete({
			where: { email: session.user.email },
		});

		// Delete user from Supabase Auth
		await supabase.auth.admin.deleteUser(session.user.id);

		return new Response('Account deleted successfully', { status: 200 });
	} catch (error) {
		console.error('Error deleting user account:', error);
		return new Response('Error deleting user account', { status: 500 });
	}
}
