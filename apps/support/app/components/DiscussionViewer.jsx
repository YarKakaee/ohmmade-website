'use client';

import { useEffect, useRef } from 'react';

export default function DiscussionViewer({ content }) {
	const viewerRef = useRef(null);
	const editorInstanceRef = useRef(null);

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			// Clean up previous instance
			if (editorInstanceRef.current) {
				editorInstanceRef.current.destroy();
				editorInstanceRef.current = null;
			}

			const EditorJS = (await import('@editorjs/editorjs')).default;
			const Header = (await import('@editorjs/header')).default;
			const List = (await import('@editorjs/list')).default;
			const ImageTool = (await import('@editorjs/image')).default;

			const CustomCodeSnippet = (
				await import('./codex/CustomCodeSnippet')
			).default;

			if (!isMounted || !viewerRef.current) return;

			// Clear the container
			viewerRef.current.innerHTML = '';

			// Create unique holder ID
			const holderId = `discussion-viewer-${Date.now()}`;
			viewerRef.current.id = holderId;

			// Add custom CSS to override EditorJS padding
			if (!document.getElementById('editorjs-readonly-fix')) {
				const style = document.createElement('style');
				style.id = 'editorjs-readonly-fix';
				style.textContent = `
					.codex-editor__redactor {
						padding-bottom: 0 !important;
					}
					.codex-editor__redactor[data-placeholder]::before {
						display: none !important;
					}
				`;
				document.head.appendChild(style);
			}

			editorInstanceRef.current = new EditorJS({
				holder: holderId,
				readOnly: true,
				data: content,
				tools: {
					header: Header,
					list: List,
					image: ImageTool,
					codeSnippet: CustomCodeSnippet,
				},
			});
		};

		init();

		return () => {
			isMounted = false;
			if (editorInstanceRef.current) {
				editorInstanceRef.current.destroy();
				editorInstanceRef.current = null;
			}
		};
	}, [content]);

	return <div ref={viewerRef} className="prose max-w-none text-white" />;
}
