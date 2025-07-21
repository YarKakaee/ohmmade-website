import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const supabase = createRouteHandlerClient({ cookies });
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('file');

		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Validate file type
		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
		];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Invalid file type. Only images are allowed.' },
				{ status: 400 }
			);
		}

		// Validate file size (5MB limit)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File too large. Maximum size is 5MB.' },
				{ status: 400 }
			);
		}

		// Generate unique filename
		const fileExt = file.name.split('.').pop();
		const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
		const filePath = `discussion-images/${fileName}`;

		// Upload to Supabase Storage
		const { error: uploadError } = await supabase.storage
			.from('discussion-images')
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: false,
				contentType: file.type,
			});

		if (uploadError) {
			console.error('Upload error:', uploadError);
			return NextResponse.json(
				{ error: 'Failed to upload file' },
				{ status: 500 }
			);
		}

		// Get public URL
		const { data: publicUrlData } = supabase.storage
			.from('discussion-images')
			.getPublicUrl(filePath);

		return NextResponse.json({
			success: 1,
			file: {
				url: publicUrlData.publicUrl,
			},
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
