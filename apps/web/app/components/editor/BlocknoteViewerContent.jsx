'use client';

import { useMemo, useEffect } from 'react';

// Component to display published content as simple HTML
export default function BlocknoteViewerContent({ data }) {
	// Process the data to create simple HTML content
	const htmlContent = useMemo(() => {
		if (!data) {
			return '<p class="text-white/60">No content available</p>';
		}

		// Helper function to extract text content from complex structures
		const extractTextContent = (item) => {
			if (!item || typeof item !== 'object') return '';

			// If it's a text item, return the text
			if (item.type === 'text' && item.text) {
				return item.text;
			}

			// If it has content, recursively extract text
			if (Array.isArray(item.content)) {
				return item.content
					.map(extractTextContent)
					.filter((text) => text)
					.join(' ');
			}

			// If it has a text property, return it
			if (item.text) {
				return item.text;
			}

			return '';
		};

		// Process the data structure
		const htmlBlocks = [];

		// If data has a content array with blockGroup
		if (
			data &&
			typeof data === 'object' &&
			data.content &&
			Array.isArray(data.content)
		) {
			// Look for blockGroup
			const blockGroup = data.content.find(
				(item) => item.type === 'blockGroup'
			);
			if (blockGroup && Array.isArray(blockGroup.content)) {
				// Process each blockContainer
				blockGroup.content.forEach((container, index) => {
					if (
						container.type === 'blockContainer' &&
						Array.isArray(container.content)
					) {
						const actualBlock = container.content[0];
						if (actualBlock && actualBlock.type) {
							// Handle different block types
							if (actualBlock.type === 'image') {
								// Images don't have text content, handle them directly
								const imageUrl = actualBlock.attrs?.url || '';
								const caption =
									actualBlock.attrs?.caption || '';
								const name = actualBlock.attrs?.name || '';

								if (imageUrl) {
									const imageHtml = `<div class="my-4"><img src="${imageUrl}" alt="${caption || name || 'Image'}" class="max-w-full h-auto rounded-lg shadow-lg" />${caption ? `<p class="text-white/60 text-sm mt-2 text-center">${caption}</p>` : ''}</div>`;
									htmlBlocks.push(imageHtml);
								}
							} else {
								// For text-based blocks, extract text content
								const textContent =
									extractTextContent(actualBlock);
								if (textContent.trim()) {
									// Map block types to HTML
									let blockType = actualBlock.type;
									if (blockType === 'codeBlock') {
										blockType = 'code';
									}

									// Create HTML based on block type
									if (blockType === 'heading') {
										const level =
											actualBlock.attrs?.level || 1;
										let headingClass = '';

										// Different styles for each heading level
										switch (level) {
											case 1:
												headingClass =
													'text-4xl font-bold text-[#27BBFF] mb-6 leading-tight';
												break;
											case 2:
												headingClass =
													'text-3xl font-bold text-white mb-5 leading-tight';
												break;
											case 3:
												headingClass =
													'text-2xl font-semibold text-white mb-4 leading-tight';
												break;
											case 4:
												headingClass =
													'text-xl font-semibold text-white mb-4 leading-tight';
												break;
											case 5:
												headingClass =
													'text-lg font-medium text-white mb-3 leading-tight';
												break;
											case 6:
												headingClass =
													'text-base font-medium text-white/90 mb-3 leading-tight';
												break;
											default:
												headingClass =
													'text-2xl font-semibold text-white mb-4 leading-tight';
										}

										htmlBlocks.push(
											`<h${level} class="${headingClass}">${textContent}</h${level}>`
										);
									} else if (blockType === 'code') {
										const language =
											actualBlock.attrs?.language ||
											'text';

										// Map common language aliases to Prism.js supported languages
										const languageMap = {
											js: 'javascript',
											javascript: 'javascript',
											ts: 'typescript',
											typescript: 'typescript',
											jsx: 'jsx',
											tsx: 'tsx',
											py: 'python',
											python: 'python',
											java: 'java',
											cpp: 'cpp',
											'c++': 'cpp',
											c: 'c',
											cs: 'csharp',
											csharp: 'csharp',
											php: 'php',
											rb: 'ruby',
											ruby: 'ruby',
											go: 'go',
											rs: 'rust',
											rust: 'rust',
											sql: 'sql',
											sh: 'bash',
											bash: 'bash',
											zsh: 'bash',
											yml: 'yaml',
											yaml: 'yaml',
											json: 'json',
											md: 'markdown',
											markdown: 'markdown',
											html: 'html',
											css: 'css',
											scss: 'scss',
											less: 'less',
											xml: 'xml',
											docker: 'docker',
											git: 'git',
											ino: 'arduino',
											arduino: 'arduino',
											hex: 'hex',
											bin: 'text',
											dat: 'text',
											log: 'text',
											text: 'text',
										};

										const mappedLanguage =
											languageMap[
												language.toLowerCase()
											] || 'text';

										// Escape HTML in code content
										const escapedContent = textContent
											.replace(/&/g, '&amp;')
											.replace(/</g, '&lt;')
											.replace(/>/g, '&gt;')
											.replace(/"/g, '&quot;')
											.replace(/'/g, '&#39;');

										htmlBlocks.push(
											`<div class="relative my-4">
												<pre class="bg-[#1c1c20] border border-[#2c2f36] rounded-lg p-4 font-mono text-sm text-white overflow-x-auto"><code class="hljs language-${mappedLanguage}">${escapedContent}</code></pre>
											</div>`
										);
									} else if (blockType === 'bulletListItem') {
										// Handle bullet list items
										htmlBlocks.push(
											`<li class="text-white mb-2 leading-relaxed list-disc ml-6">${textContent}</li>`
										);
									} else if (
										blockType === 'numberedListItem'
									) {
										// Handle numbered list items
										htmlBlocks.push(
											`<li class="text-white mb-2 leading-relaxed list-decimal ml-6">${textContent}</li>`
										);
									} else if (blockType === 'bulletList') {
										// Handle bullet list container
										htmlBlocks.push(
											`<ul class="text-white mb-4 leading-relaxed list-disc ml-6 space-y-2">${textContent}</ul>`
										);
									} else if (blockType === 'numberedList') {
										// Handle numbered list container
										htmlBlocks.push(
											`<ol class="text-white mb-4 leading-relaxed list-decimal ml-6 space-y-2">${textContent}</ol>`
										);
									} else {
										// Default to paragraph
										htmlBlocks.push(
											`<p class="text-white mb-4 leading-relaxed">${textContent}</p>`
										);
									}
								}
							}
						}
					}
				});

				if (htmlBlocks.length > 0) {
					return htmlBlocks.join('');
				}
			}
		}

		// If we can't process the data, return fallback
		return '<p class="text-white/60">Content could not be loaded properly.</p>';
	}, [data]);

	// Apply syntax highlighting using highlight.js (same as Editor.js custom code block)
	useEffect(() => {
		const loadHighlightJS = () => {
			// Load highlight.js + line numbers (safe one-time inject) - EXACTLY as in CustomCodeSnippet.js
			if (!document.getElementById('hljs-style')) {
				const link = document.createElement('link');
				link.id = 'hljs-style';
				link.rel = 'stylesheet';
				link.href =
					'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css';
				document.head.appendChild(link);
			}
			if (!document.getElementById('recursive-mono-font')) {
				const fontLink = document.createElement('link');
				fontLink.id = 'recursive-mono-font';
				fontLink.rel = 'stylesheet';
				fontLink.href =
					'https://fonts.googleapis.com/css2?family=Recursive+Mono:wght@400;600&display=swap';
				document.head.appendChild(fontLink);
			}
			if (!window.hljsLoaded) {
				const hljsScript = document.createElement('script');
				hljsScript.src =
					'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js';
				hljsScript.onload = () => {
					window.hljs.initHighlightingOnLoad();
					window.hljsLoaded = true;

					// Now load line numbers only after hljs is available
					const lnScript = document.createElement('script');
					lnScript.src =
						'https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js';
					lnScript.onload = () => {
						// optional: you could set a flag if needed
						window.hljsLineNumbersLoaded = true;
					};
					document.head.appendChild(lnScript);
				};
				document.head.appendChild(hljsScript);
			}

			if (!document.getElementById('hljs-ln-align-fix')) {
				const style = document.createElement('style');
				style.id = 'hljs-ln-align-fix';
				style.textContent = `
					/* Align line numbers right and fix spacing */
					.hljs-ln-numbers {
						text-align: right;
						padding-right: 12px !important;
						color: #757575;
						user-select: none;
						width: 2.5em; /* fixed width for clean alignment */
						vertical-align: top;
						box-sizing: content-box;
					}
					.hljs-ln-code {
						padding-left: 0.75rem !important; /* tighter spacing */
					}
				`;
				document.head.appendChild(style);
			}

			// Apply highlighting after a short delay
			setTimeout(() => {
				const codeBlocks = document.querySelectorAll(
					'.blocknote-viewer-container pre code'
				);

				if (window.hljs) {
					codeBlocks.forEach((block) => {
						window.hljs.highlightElement(block);

						requestAnimationFrame(() => {
							if (
								window.hljs.lineNumbersBlock &&
								typeof window.hljs.lineNumbersBlock ===
									'function'
							) {
								window.hljs.lineNumbersBlock(block);
							}
						});
					});
				}
			}, 100);
		};

		// Load highlight.js after content is rendered
		const timer = setTimeout(loadHighlightJS, 300);
		return () => clearTimeout(timer);
	}, [htmlContent]);

	if (!data) {
		return (
			<div className="min-h-[200px] rounded-xl border border-[#2C2F36] flex items-center justify-center">
				<p className="text-white/60">No content available</p>
			</div>
		);
	}

	return (
		<div className="blocknote-viewer-container">
			<div
				className="min-h-[200px] rounded-xl bg-[#13151A] p-6 text-white"
				dangerouslySetInnerHTML={{ __html: htmlContent }}
			/>

			{/* Custom CSS for styling */}
			<style jsx global>{`
				.blocknote-viewer-container {
					font-family:
						'Inter',
						system-ui,
						-apple-system,
						sans-serif;
				}
				/* Heading styles - ensure distinct sizes and hierarchy */
				.blocknote-viewer-container h1 {
					font-size: 2.25rem !important; /* text-4xl */
					line-height: 1.2 !important;
					font-weight: 700 !important; /* font-bold */
					color: #27bbff !important;
					margin: 1.5rem 0 1rem 0 !important;
					letter-spacing: -0.025em !important;
				}
				.blocknote-viewer-container h2 {
					font-size: 1.875rem !important; /* text-3xl */
					line-height: 1.25 !important;
					font-weight: 700 !important; /* font-bold */
					color: #ffffff !important;
					margin: 1.25rem 0 1rem 0 !important;
					letter-spacing: -0.025em !important;
				}
				.blocknote-viewer-container h3 {
					font-size: 1.5rem !important; /* text-2xl */
					line-height: 1.25 !important;
					font-weight: 600 !important; /* font-semibold */
					color: #ffffff !important;
					margin: 1rem 0 0.75rem 0 !important;
					letter-spacing: -0.025em !important;
				}
				.blocknote-viewer-container h4 {
					font-size: 1.25rem !important; /* text-xl */
					line-height: 1.25 !important;
					font-weight: 600 !important; /* font-semibold */
					color: #ffffff !important;
					margin: 1rem 0 0.75rem 0 !important;
					letter-spacing: -0.025em !important;
				}
				.blocknote-viewer-container h5 {
					font-size: 1.125rem !important; /* text-lg */
					line-height: 1.25 !important;
					font-weight: 500 !important; /* font-medium */
					color: #ffffff !important;
					margin: 0.75rem 0 0.5rem 0 !important;
					letter-spacing: -0.025em !important;
				}
				.blocknote-viewer-container h6 {
					font-size: 1rem !important; /* text-base */
					line-height: 1.25 !important;
					font-weight: 500 !important; /* font-medium */
					color: rgba(255, 255, 255, 0.9) !important;
					margin: 0.75rem 0 0.5rem 0 !important;
					letter-spacing: -0.025em !important;
				}
				/* Paragraph styles */
				.blocknote-viewer-container p {
					color: #ffffff !important;
					font-size: 16px;
					line-height: 1.6;
					margin: 16px 0 !important;
				}
				/* Code block styles with highlight.js integration */
				.blocknote-viewer-container pre {
					background: #1c1c20 !important;
					border: 1px solid #2c2f36 !important;
					border-radius: 8px;
					padding: 16px;
					margin: 16px 0 !important;
					font-family:
						'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
					font-size: 14px;
					line-height: 1.5;
					overflow-x: auto;
					position: relative;
				}
				.blocknote-viewer-container code {
					background: transparent !important;
					color: #ffffff !important;
					font-family: inherit;
				}
				/* Image styles - ensure they are visible */
				.blocknote-viewer-container img {
					display: block !important;
					max-width: 100% !important;
					height: auto !important;
					border-radius: 8px !important;
					margin: 16px 0 !important;
					box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
					background: #1c1c20 !important;
					border: 1px solid #2c2f36 !important;
				}
				/* Link styles */
				.blocknote-viewer-container a {
					color: #27bbff !important;
					text-decoration: underline;
				}
				.blocknote-viewer-container a:hover {
					color: #1e40af !important;
				}
				/* List styles */
				.blocknote-viewer-container ul {
					list-style-type: disc !important;
					margin: 16px 0 !important;
					padding-left: 24px !important;
				}
				.blocknote-viewer-container ol {
					list-style-type: decimal !important;
					margin: 16px 0 !important;
					padding-left: 24px !important;
				}
				.blocknote-viewer-container li {
					margin: 8px 0 !important;
					line-height: 1.6 !important;
					color: #ffffff !important;
				}
				.blocknote-viewer-container ul li {
					list-style-type: disc !important;
				}
				.blocknote-viewer-container ol li {
					list-style-type: decimal !important;
				}
				/* Nested list styles */
				.blocknote-viewer-container ul ul {
					margin: 8px 0 !important;
				}
				.blocknote-viewer-container ol ol {
					margin: 8px 0 !important;
				}
				.blocknote-viewer-container ul ol {
					margin: 8px 0 !important;
				}
				.blocknote-viewer-container ol ul {
					margin: 8px 0 !important;
				}
			`}</style>
		</div>
	);
}
