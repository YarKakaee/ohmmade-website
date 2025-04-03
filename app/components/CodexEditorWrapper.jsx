'use client';

import React, { useEffect, useRef } from 'react';

let editorInstance = null;

export const getEditorData = async () => {
	if (editorInstance) {
		return await editorInstance.save();
	}
	return null;
};

export default function CodexEditorWrapper() {
	const editorRef = useRef(null);

	useEffect(() => {
		let isMounted = true;

		const initEditor = async () => {
			const EditorJS = (await import('@editorjs/editorjs')).default;
			const Header = (await import('@editorjs/header')).default;
			const List = (await import('@editorjs/list')).default;
			const Code = (await import('@editorjs/code')).default;

			if (!editorRef.current && isMounted) {
				const editor = new EditorJS({
					holder: 'codex-editor',
					placeholder: 'Start writing content here...',
					tools: {
						header: Header,
						list: List,
						code: Code,
					},
				});
				editorRef.current = editor;
				editorInstance = editor;
			}
		};

		initEditor();

		return () => {
			isMounted = false;
			if (editorInstance?.destroy) editorInstance.destroy();
		};
	}, []);

	return <div id="codex-editor" className="text-white" />;
}
