// /app/api/uploadFile/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
	try {
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		);
		const formData = await req.formData();
		// Try both 'image' and 'file' form fields for backwards compatibility
		const file = formData.get('image') || formData.get('file');

		if (!file) {
			return NextResponse.json({
				success: 0,
				message: 'No file provided',
			});
		}

		// Validate file size (50MB max)
		const maxSize = 50 * 1024 * 1024; // 50MB
		if (file.size > maxSize) {
			return NextResponse.json({
				success: 0,
				message: 'File size too large. Maximum allowed size is 50MB.',
			});
		}

		const fileExt = file.name.split('.').pop();
		const filePath = `editor-uploads/${Date.now()}.${fileExt}`;

		const { data, error } = await supabase.storage
			.from('editor-images')
			.upload(filePath, file, {
				upsert: true,
				cacheControl: '3600',
				contentType: file.type,
			});

		if (error) {
			console.error('Upload error:', error.message);
			return NextResponse.json({ success: 0, message: error.message });
		}

		const { data: publicUrlData } = supabase.storage
			.from('editor-images')
			.getPublicUrl(filePath);

		return NextResponse.json({
			success: 1,
			file: {
				url: publicUrlData.publicUrl,
				name: file.name,
				size: file.size,
				type: file.type,
			},
		});
	} catch (error) {
		console.error('Upload API error:', error);
		return NextResponse.json({
			success: 0,
			message: 'Upload failed. Please try again.',
		});
	}
}
