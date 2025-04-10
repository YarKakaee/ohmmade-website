export default class CustomCodeSnippet {
	constructor({ data, api, readOnly }) {
		this.api = api;
		this.readOnly = readOnly;
		this.data = {
			language: data.language || 'c++',
			title: data.title || '',
			description: data.description || '',
			code: data.code || '',
			showPreview: data.showPreview ?? false,
		};
		this.wrapper = undefined;
	}

	static get toolbox() {
		return {
			title: 'Code',
			icon: `<svg width="17" height="17"><path d="M6.5 13l-4-4 4-4m4 8l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
		};
	}

	static get isReadOnlySupported() {
		return true;
	}

	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.className = 'w-full relative';

		// Load highlight.js + line numbers (safe one-time inject)
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

		if (this.readOnly || this.data.showPreview) {
			this.wrapper.innerHTML = `
				<div class="snippet-preview mt-4">
					<div class="rounded-xl bg-[#18181C] p-4 mb-4 border border-white/10">
						<div class="flex items-center gap-4 mb-4">
							<span class="lang-badge text-xs font-semibold bg-[#303034] text-white px-2 py-1 rounded">${this._formatLang(
								this.data.language
							)}</span>
							<p class="preview-title text-white font-black text-xl">${this.data.title}</p>
						</div>
						<pre class="whitespace-pre-wrap overflow-auto -mt-6 text-white" style="background-color: #18181C !important; font-family: 'Recursive Mono', monospace; font-size: 14px;">
<code class="hljs language-${
				this.data.language
			}" style="background-color: transparent !important;">${this._escapeHtml(
				this.data.code
			)}</code>
</pre>
${
	this.data.description.trim()
		? `
	<p class="preview-desc text-white/70 text-sm mt-3">${this.data.description}</p>
`
		: '<p class="preview-desc text-white/70 text-sm -mt-4" />'
}
					</div>
				</div>
			`;

			setTimeout(() => {
				const blocks = this.wrapper.querySelectorAll('pre code.hljs');

				if (window.hljs) {
					blocks.forEach((block) => {
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
			}, 0);
		} else {
			this.wrapper.innerHTML = `
				<div class="snippet-form">
					<label class="block text-white/60 text-sm font-medium">
						Type <span class="text-[#FFC008]">*</span>
						<select class="snippet-language mt-2 w-full border border-[#6B6B6D] rounded-md px-3 py-2 bg-[#1C1C20] text-white/70">
							${this._getLanguagesOptions(this.data.language)}
						</select>
					</label>

					<label class="block mt-4 text-white/60 text-sm font-medium">
						Title
						<input type="text" class="snippet-title mt-2 block w-full bg-[#1C1C20] text-white border border-gray-600 rounded-md px-3 py-2" value="${
							this.data.title
						}">
					</label>

					<label class="block mt-4 text-white/60 text-sm font-medium">
						Snippet code <span class="text-[#FFC008]">*</span>
						<textarea rows="10" class="snippet-code mt-2 block w-full bg-[#1C1C20] text-white border border-gray-600 rounded-md px-3 py-2">${
							this.data.code
						}</textarea>
					</label>

					<label class="block mt-4 text-white/60 text-sm font-medium">
						Description
						<textarea rows="2" class="snippet-description mt-2 block w-full bg-[#1C1C20] text-white border border-gray-600 rounded-md px-3 py-2">${
							this.data.description
						}</textarea>
					</label>

					<div class="mt-4 flex gap-3 mb-4">
						<button class="cursor-pointer btn-save bg-[#27BBFF] text-[#101014] px-4 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition">Save</button>
					</div>
				</div>
			`;

			this.wrapper
				.querySelector('.btn-save')
				?.addEventListener('click', () => this._savePreview());
		}

		return this.wrapper;
	}

	_savePreview() {
		this.data = {
			language: this.wrapper.querySelector('.snippet-language').value,
			title: this.wrapper.querySelector('.snippet-title').value,
			code: this.wrapper.querySelector('.snippet-code').value,
			description: this.wrapper.querySelector('.snippet-description')
				.value,
			showPreview: true,
		};

		// Replace the innerHTML of this.wrapper directly
		this.wrapper.innerHTML = `
			<div class="snippet-preview mt-4">
				<div class="rounded-xl bg-[#18181C] p-4 mb-4 border border-white/10">
					<div class="flex items-center gap-4 mb-4">
						<span class="lang-badge text-xs font-semibold bg-[#303034] text-white px-2 py-1 rounded">${this._formatLang(
							this.data.language
						)}</span>
						<p class="preview-title text-white font-black text-xl">${this.data.title}</p>
					</div>
					<pre class="whitespace-pre-wrap overflow-auto -mt-6 text-white" style="background-color: #18181C !important; font-family: 'Recursive Mono', monospace; font-size: 14px;">
	<code class="hljs language-${
		this.data.language
	}" style="background-color: transparent !important; font-family: 'Recursive Mono', monospace; font-size: 14px;">${this._escapeHtml(
			this.data.code
		)}</code></pre>
					${
						this.data.description.trim()
							? `<p class="preview-desc text-white/70 text-sm mt-3">${this.data.description}</p>`
							: ''
					}
				</div>
			</div>
		`;

		// Highlight and line numbers
		setTimeout(() => {
			if (window.hljs) {
				window.hljs.highlightAll();
			}
			if (
				window.hljs &&
				typeof window.hljs.lineNumbersBlock === 'function'
			) {
				const codeBlocks =
					this.wrapper.querySelectorAll('pre code.hljs');
				codeBlocks.forEach((block) => {
					window.hljs.lineNumbersBlock(block);
				});
			}
		}, 0);
	}

	save() {
		return this.data;
	}

	_escapeHtml(str) {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	_getLanguagesOptions(selected) {
		const langs = [
			'C++',
			'Python',
			'Shell',
			'Java',
			'JavaScript',
			'C#',
			'console_output',
			'C',
			'HTML',
			'CSS',
		];
		return langs
			.map(
				(lang) =>
					`<option value="${lang}" ${
						lang === selected ? 'selected' : ''
					}>${this._formatLang(lang)}</option>`
			)
			.join('');
	}

	_formatLang(lang) {
		return lang.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}
}
