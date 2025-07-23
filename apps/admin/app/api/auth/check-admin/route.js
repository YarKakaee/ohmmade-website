import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		const supabase = createRouteHandlerClient({ cookies });

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			return NextResponse.json({ isAdmin: false }, { status: 401 });
		}

		// Only allow info@ohmmade.ca for admin access
		const isAdmin = user.email === 'admin@ohmmade.ca';

		return NextResponse.json({
			isAdmin,
			user: { id: user.id, email: user.email },
		});
	} catch (error) {
		return NextResponse.json(
			{ isAdmin: false, error: error.message },
			{ status: 500 }
		);
	}
}
