'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const CodexEditorWrapper = forwardRef((props, ref) => {
	const editorInstanceRef = useRef(null);

	useImperativeHandle(ref, () => ({
		save: async () => {
			if (editorInstanceRef.current) {
				return await editorInstanceRef.current.save();
			}
			throw new Error('Editor not initialized');
		},
		clear: async () => {
			if (editorInstanceRef.current) {
				await editorInstanceRef.current.clear();
				await editorInstanceRef.current.render({ blocks: [] });
			}
		},
	}));

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			const EditorJS = (await import('@editorjs/editorjs')).default;
			const Header = (await import('@editorjs/header')).default;
			const List = (await import('@editorjs/list')).default;
			const CodeTool = (await import('@editorjs/code')).default;
			const ImageTool = (await import('@editorjs/image')).default;

			// 💡 Import your custom code snippet plugin
			const CustomCodeSnippet = (
				await import('@/app/components/codex/CustomCodeSnippet')
			).default;

			if (!isMounted) return;

			editorInstanceRef.current = new EditorJS({
				holder: 'codex-editor',
				tools: {
					header: Header,
					list: List,
					image: {
						class: ImageTool,
						config: {
							endpoints: {
								byFile: '/api/uploadFile',
							},
						},
					},
					codeSnippet: CustomCodeSnippet,
				},
				placeholder: 'Start adding content here...',
			});
		};

		init();

		return () => {
			isMounted = false;
			if (
				editorInstanceRef.current &&
				editorInstanceRef.current.destroy
			) {
				editorInstanceRef.current.destroy();
				editorInstanceRef.current = null;
			}
		};
	}, []);

	return <div id="codex-editor" className="min-h-[400px]" />;
});

CodexEditorWrapper.displayName = 'CodexEditorWrapper';
export default CodexEditorWrapper;
