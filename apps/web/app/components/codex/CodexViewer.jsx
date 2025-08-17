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
			const CustomFileTool = (
				await import('@/app/components/codex/CustomFileTool')
			).default;

			if (!isMounted) return;

			// Add custom CSS for hiding empty image captions
			if (!document.getElementById('editor-image-caption-styles')) {
				const style = document.createElement('style');
				style.id = 'editor-image-caption-styles';
				style.textContent = `
					/* Hide empty image captions in read-only mode */
					#codex-viewer .image-tool__caption[data-placeholder]:empty {
						display: none !important;
					}
					#codex-viewer .image-tool__caption:empty {
						display: none !important;
					}
					#codex-viewer .image-tool__caption:not(:empty) {
						margin-top: 8px;
						padding: 8px 12px;
						background: rgba(255, 255, 255, 0.05);
						border-radius: 8px;
						font-size: 14px;
						color: rgba(255, 255, 255, 0.7);
						font-style: italic;
						border-left: 3px solid #27BBFF;
					}
				`;
				document.head.appendChild(style);
			}

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
					file: CustomFileTool,
				},
			});

			// After initialization, hide empty captions
			setTimeout(() => {
				const viewer = document.getElementById('codex-viewer');
				if (viewer) {
					const captions = viewer.querySelectorAll(
						'.image-tool__caption'
					);
					captions.forEach((caption) => {
						if (!caption.textContent.trim()) {
							caption.style.display = 'none';
						}
					});
				}
			}, 500);
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
