// /app/api/uploadFile/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);
	const formData = await req.formData();
	const file = formData.get('image');

	if (!file) {
		return NextResponse.json({ success: 0, message: 'No file provided' });
	}

	const fileExt = file.name.split('.').pop();
	const filePath = `editor-uploads/${Date.now()}.${fileExt}`;

	const { data, error } = await supabase.storage
		.from('editor-images')
		.upload(filePath, file, {
			upsert: true,
			cacheControl: '3600',
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
		},
	});
}
