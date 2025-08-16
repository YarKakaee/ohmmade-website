'use client';

import '@blocknote/core/fonts/inter.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

// Our <Editor> component with OhmMade styling
export default function Editor() {
	// Creates a new editor instance with no initial content
	const editor = useCreateBlockNote({
		uploadFile: async (file) => {
			try {
				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/uploadFile', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error('Upload failed');
				}

				const data = await response.json();
				return data.url;
			} catch (error) {
				console.error('File upload error:', error);
				return '';
			}
		},
	});

	// Renders the editor instance using a React component with OhmMade styling.
	return (
		<div className="blocknote-editor-container">
			<BlockNoteView
				editor={editor}
				theme="dark"
				className="min-h-[500px] rounded-xl bg-[#1C1C20]"
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
					background: rgba(28, 28, 32) !important;
					min-height: 500px;
					color: #ffffff !important;
				}
			`}</style>
		</div>
	);
}
