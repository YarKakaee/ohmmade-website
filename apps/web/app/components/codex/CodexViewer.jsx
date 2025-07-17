'use client';

import { useEffect, useRef } from 'react';

export default function CodexViewer({ data }) {
	const viewerRef = useRef(null);

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			const EditorJS = (await import('@editorjs/editorjs')).default;
			const Header = (await import('@editorjs/header')).default;
			const List = (await import('@editorjs/list')).default;
			const CodeTool = (await import('@editorjs/code')).default;
			const ImageTool = (await import('@editorjs/image')).default;

			const CustomCodeSnippet = (
				await import('@/app/components/codex/CustomCodeSnippet')
			).default;

			if (!isMounted) return;

			new EditorJS({
				holder: 'codex-viewer',
				readOnly: true, // ✅ Read-only mode
				data: data, // ⬅️ Pass your saved JSON here
				tools: {
					header: Header,
					list: List,
					image: ImageTool,
					codeSnippet: CustomCodeSnippet,
					code: CodeTool,
				},
			});
		};

		init();

		return () => {
			isMounted = false;
		};
	}, [data]);

	return (
		<div
			ref={viewerRef}
			className="prose max-w-none text-white"
			id="codex-viewer"
		/>
	);
}
