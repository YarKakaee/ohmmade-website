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
		const file = formData.get('file'); // Blocknote sends 'file', not 'image'

		if (!file) {
			return NextResponse.json(
				{
					success: 0,
					message: 'No file provided',
				},
				{ status: 400 }
			);
		}

		// Check file type
		const fileType = file.type;
		const fileExt = file.name.split('.').pop().toLowerCase();

		// Allow images, videos, documents, archives, and other project files
		const allowedImageTypes = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/gif',
			'image/webp',
			'image/svg+xml',
		];
		const allowedVideoTypes = [
			'video/mp4',
			'video/webm',
			'video/ogg',
			'video/quicktime',
			'video/x-msvideo',
		];
		const allowedDocumentTypes = [
			'application/pdf',
			'text/plain',
			'text/csv',
			'application/json',
			'application/xml',
			'text/xml',
		];
		const allowedArchiveTypes = [
			'application/zip',
			'application/x-zip-compressed',
			'application/x-rar-compressed',
			'application/x-7z-compressed',
			'application/gzip',
			'application/x-tar',
		];
		const allowedCodeTypes = [
			'text/javascript',
			'text/css',
			'text/html',
			'application/javascript',
			'application/x-python',
			'text/x-python',
			'text/x-c++src',
			'text/x-c',
			'text/x-java-source',
		];
		const allowedExtensions = [
			'jpg',
			'jpeg',
			'png',
			'gif',
			'webp',
			'svg',
			'mp4',
			'webm',
			'ogg',
			'mov',
			'avi',
			'pdf',
			'txt',
			'csv',
			'json',
			'xml',
			'zip',
			'rar',
			'7z',
			'gz',
			'tar',
			'js',
			'css',
			'html',
			'py',
			'cpp',
			'c',
			'java',
			'ino',
			'hex',
			'bin',
			'dat',
			'log',
		];

		const isAllowedType =
			allowedImageTypes.includes(fileType) ||
			allowedVideoTypes.includes(fileType) ||
			allowedDocumentTypes.includes(fileType) ||
			allowedArchiveTypes.includes(fileType) ||
			allowedCodeTypes.includes(fileType) ||
			allowedExtensions.includes(fileExt);

		if (!isAllowedType) {
			return NextResponse.json(
				{
					success: 0,
					message:
						'File type not supported. Please upload images, videos, documents, archives, or code files. Supported formats: JPG, PNG, GIF, WebP, SVG, MP4, WebM, OGG, MOV, AVI, PDF, TXT, CSV, JSON, XML, ZIP, RAR, 7Z, GZ, TAR, JS, CSS, HTML, PY, CPP, C, Java, INO, HEX, BIN, DAT, LOG',
				},
				{ status: 400 }
			);
		}

		// Check file size (max 100MB for most files, 200MB for archives)
		const maxSize =
			allowedArchiveTypes.includes(fileType) ||
			(allowedExtensions.includes(fileExt) &&
				['zip', 'rar', '7z', 'gz', 'tar'].includes(fileExt))
				? 200 * 1024 * 1024
				: 100 * 1024 * 1024;

		if (file.size > maxSize) {
			const maxSizeMB = maxSize / (1024 * 1024);
			return NextResponse.json(
				{
					success: 0,
					message: `File too large. Maximum size: ${maxSizeMB}MB`,
				},
				{ status: 400 }
			);
		}

		const filePath = `editor-uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

		const { data, error } = await supabase.storage
			.from('editor-images')
			.upload(filePath, file, {
				upsert: true,
				cacheControl: '3600',
			});

		if (error) {
			console.error('Upload error:', error.message);
			return NextResponse.json(
				{
					success: 0,
					message: `Upload failed: ${error.message}`,
				},
				{ status: 500 }
			);
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
				type: fileType,
				extension: fileExt,
				isDownloadable:
					!allowedImageTypes.includes(fileType) &&
					!allowedVideoTypes.includes(fileType),
			},
		});
	} catch (error) {
		console.error('Upload API error:', error);
		return NextResponse.json(
			{
				success: 0,
				message: 'Internal server error during upload',
			},
			{ status: 500 }
		);
	}
}
