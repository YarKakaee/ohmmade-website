'use client';

import {
	useState,
	forwardRef,
	useImperativeHandle,
	useEffect,
	useRef,
} from 'react';
import '@blocknote/core/fonts/inter.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

// Our <Editor> component with OhmMade styling
const Editor = forwardRef((props, ref) => {
	const [uploadStatus, setUploadStatus] = useState('');
	const blockNoteViewRef = useRef(null);

	// Creates a new editor instance with no initial content
	const editor = useCreateBlockNote({
		uploadFile: async (file) => {
			try {
				setUploadStatus(`Uploading ${file.name}...`);

				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/uploadFile', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Upload failed');
				}

				const data = await response.json();

				if (data.success === 1) {
					const fileType = data.file.isDownloadable
						? 'downloadable file'
						: 'media file';
					setUploadStatus(
						`${file.name} uploaded successfully as ${fileType}!`
					);
					setTimeout(() => setUploadStatus(''), 3000);
					return data.file.url;
				} else {
					throw new Error(data.message || 'Upload failed');
				}
			} catch (error) {
				console.error('File upload error:', error);
				setUploadStatus(`Upload failed: ${error.message}`);
				setTimeout(() => setUploadStatus(''), 5000);
				return '';
			}
		},
	});

	// Debug: Log available methods on the editor
	useEffect(() => {
		if (editor) {
			console.log('Blocknote editor created:', editor);
			console.log(
				'Available methods:',
				Object.getOwnPropertyNames(editor)
			);
			console.log(
				'Editor prototype methods:',
				Object.getOwnPropertyNames(Object.getPrototypeOf(editor))
			);

			// Check if editor has a different structure
			if (editor._tiptapEditor) {
				console.log('Found _tiptapEditor:', editor._tiptapEditor);
				console.log(
					'Tiptap methods:',
					Object.getOwnPropertyNames(editor._tiptapEditor)
				);
			}
		}
	}, [editor]);

	// Expose methods to parent component
	useImperativeHandle(ref, () => ({
		save: async () => {
			try {
				console.log('Attempting to save editor content...');
				console.log('Editor object:', editor);

				// Try multiple approaches to get content
				if (typeof editor.getJSON === 'function') {
					console.log('Using editor.getJSON()');
					return editor.getJSON();
				} else if (typeof editor.getBlocks === 'function') {
					console.log('Using editor.getBlocks()');
					return editor.getBlocks();
				} else if (typeof editor.getDocument === 'function') {
					console.log('Using editor.getDocument()');
					return editor.getDocument();
				} else if (
					editor._tiptapEditor &&
					typeof editor._tiptapEditor.getJSON === 'function'
				) {
					console.log('Using editor._tiptapEditor.getJSON()');
					return editor._tiptapEditor.getJSON();
				} else if (editor._tiptapEditor) {
					console.log('Found _tiptapEditor but no getJSON method');
					console.log(
						'Tiptap methods:',
						Object.getOwnPropertyNames(editor._tiptapEditor)
					);

					// Try to get content from tiptap editor
					if (typeof editor._tiptapEditor.getJSON === 'function') {
						return editor._tiptapEditor.getJSON();
					} else if (
						typeof editor._tiptapEditor.getHTML === 'function'
					) {
						return { html: editor._tiptapEditor.getHTML() };
					}
				} else {
					// Log what we have and try to return a basic structure
					console.log(
						'Available editor methods:',
						Object.getOwnPropertyNames(editor)
					);
					console.log('Editor type:', typeof editor);
					console.log(
						'Editor constructor:',
						editor.constructor?.name
					);
					console.log('Editor keys:', Object.keys(editor));

					// Try to access content through the editor's internal state
					if (editor._tiptapEditor) {
						console.log(
							'Found _tiptapEditor, trying to get content'
						);
						return editor._tiptapEditor.getJSON();
					}

					// Check if content is stored in a different property
					if (editor.content) {
						console.log('Found editor.content');
						return editor.content;
					} else if (editor.blocks) {
						console.log('Found editor.blocks');
						return editor.blocks;
					}

					// Return a basic structure that might work
					console.log('Returning fallback structure');
					return {
						content: [],
						blocks: [],
						raw: editor,
						version: '0.35.0',
						fallback: true,
					};
				}
			} catch (error) {
				console.error('Error saving editor content:', error);
				// Return a fallback structure
				return {
					content: [],
					blocks: [],
					error: error.message,
					fallback: true,
				};
			}
		},
		clear: async () => {
			try {
				if (typeof editor.clearBlocks === 'function') {
					editor.clearBlocks();
				} else if (typeof editor.clear === 'function') {
					editor.clear();
				} else if (typeof editor.removeBlocks === 'function') {
					editor.removeBlocks();
				} else if (
					editor._tiptapEditor &&
					typeof editor._tiptapEditor.clear === 'function'
				) {
					editor._tiptapEditor.clear();
				} else {
					console.error('Clear method not available on editor');
				}
			} catch (error) {
				console.error('Error clearing editor:', error);
			}
		},
		getContent: () => {
			try {
				if (typeof editor.getJSON === 'function') {
					return editor.getJSON();
				} else if (typeof editor.getBlocks === 'function') {
					return editor.getBlocks();
				} else if (typeof editor.getDocument === 'function') {
					return editor.getDocument();
				} else if (
					editor._tiptapEditor &&
					typeof editor._tiptapEditor.getJSON === 'function'
				) {
					return editor._tiptapEditor.getJSON();
				} else {
					console.error('Get content method not available on editor');
					return null;
				}
			} catch (error) {
				console.error('Error getting editor content:', error);
				return null;
			}
		},
		getText: () => {
			try {
				if (typeof editor.getText === 'function') {
					return editor.getText();
				} else if (typeof editor.getPlainText === 'function') {
					return editor.getPlainText();
				} else if (
					editor._tiptapEditor &&
					typeof editor._tiptapEditor.getText === 'function'
				) {
					return editor._tiptapEditor.getText();
				} else {
					console.error('Get text method not available on editor');
					return '';
				}
			} catch (error) {
				console.error('Error getting editor text:', error);
				return '';
			}
		},
	}));

	// Renders the editor instance using a React component with OhmMade styling.
	return (
		<div className="blocknote-editor-container">
			{/* Upload Status Indicator */}
			{uploadStatus && (
				<div
					className={`mb-4 p-3 rounded-lg text-sm font-medium ${
						uploadStatus.includes('Uploading')
							? 'bg-[#27BBFF]/20 text-[#27BBFF] border border-[#27BBFF]/30'
							: uploadStatus.includes('successfully')
								? 'bg-[#35AC47]/20 text-[#35AC47] border border-[#35AC47]/30'
								: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
					}`}
				>
					{uploadStatus}
				</div>
			)}

			<BlockNoteView
				ref={blockNoteViewRef}
				editor={editor}
				theme="dark"
				className="min-h-[500px] rounded-xl bg-[#13151A]"
			/>

			{/* Custom CSS for OhmMade styling */}
			<style jsx global>{`
				.blocknote-editor-container {
					font-family:
						'Inter',
						system-ui,
						-apple-system,
						sans-serif;
				}

				/* Main editor container */
				.blocknote-editor-container .bn-container {
					background: transparent !important;
					border: none !important;
					box-shadow: none !important;
				}

				/* Override dark theme background */
				.blocknote-editor-container .bn-editor {
					background: #13151a !important;
					min-height: 500px;
					color: #ffffff !important;
				}
			`}</style>
		</div>
	);
});

Editor.displayName = 'Editor';

export default Editor;
