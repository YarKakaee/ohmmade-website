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
				<div class="snippet-preview">
					<div class="rounded-xl bg-[#18181C] border border-white/10 overflow-hidden">
						<div class="flex items-center gap-4 p-4 border-b border-white/10">
							<span class="lang-badge text-xs font-semibold bg-[#303034] text-white px-2 py-1 rounded">${this._formatLang(
								this.data.language
							)}</span>
							<p class="preview-title text-white font-bold text-lg">${this.data.title || 'Code Snippet'}</p>
						</div>
						<pre class="m-0 p-4 text-white" style="background-color: #18181C !important; font-family: 'Recursive Mono', monospace; font-size: 14px;">
<code class="hljs language-${
				this.data.language
			}" style="background-color: #18181C !important; font-family: 'Recursive Mono', monospace; font-size: 14px;">${this._escapeHtml(
				this.data.code
			)}</code>
						</pre>
						${
							this.data.description
								? `<div class="p-4 pt-0 border-t border-white/10"><p class="text-white/70 text-sm m-0">${this.data.description}</p></div>`
								: ''
						}
					</div>
				</div>
			`;

			// Apply syntax highlighting after a short delay
			setTimeout(() => {
				if (window.hljs) {
					window.hljs.highlightAll();
				}
			}, 100);

			return this.wrapper;
		}

		// Edit mode
		this.wrapper.innerHTML = `
			<div class="snippet-editor">
				<div class="mb-4">
					<label class="block text-sm font-medium text-white/80 mb-2">Language</label>
					<select class="w-full px-3 py-2 bg-[#18181C] border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#35AC47]">
						${this._getLanguagesOptions(this.data.language)}
					</select>
				</div>
				<div class="mb-4">
					<label class="block text-sm font-medium text-white/80 mb-2">Title</label>
					<input type="text" class="w-full px-3 py-2 bg-[#18181C] border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#35AC47]" value="${this.data.title}" placeholder="Enter code snippet title">
				</div>
				<div class="mb-4">
					<label class="block text-sm font-medium text-white/80 mb-2">Code</label>
					<textarea class="w-full h-32 px-3 py-2 bg-[#18181C] border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#35AC47] font-mono text-sm" placeholder="Enter your code here">${this.data.code}</textarea>
				</div>
				<div class="mb-4">
					<label class="block text-sm font-medium text-white/80 mb-2">Description (optional)</label>
					<textarea class="w-full px-3 py-2 bg-[#18181C] border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#35AC47]" placeholder="Enter description">${this.data.description}</textarea>
				</div>
				<div class="mb-4">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" class="w-4 h-4 text-[#35AC47] bg-[#18181C] border-white/20 rounded focus:ring-[#35AC47]" ${this.data.showPreview ? 'checked' : ''}>
						<span class="text-sm text-white/80">Show preview</span>
					</label>
				</div>
			</div>
		`;

		this._attachEventListeners();

		return this.wrapper;
	}

	_attachEventListeners() {
		const languageSelect = this.wrapper.querySelector('select');
		const titleInput = this.wrapper.querySelector('input[type="text"]');
		const codeTextarea = this.wrapper.querySelector('textarea');
		const descriptionTextarea =
			this.wrapper.querySelectorAll('textarea')[1];
		const previewCheckbox = this.wrapper.querySelector(
			'input[type="checkbox"]'
		);

		languageSelect.addEventListener('change', () => {
			this.data.language = languageSelect.value;
		});

		titleInput.addEventListener('input', () => {
			this.data.title = titleInput.value;
		});

		codeTextarea.addEventListener('input', () => {
			this.data.code = codeTextarea.value;
		});

		descriptionTextarea.addEventListener('input', () => {
			this.data.description = descriptionTextarea.value;
		});

		previewCheckbox.addEventListener('change', () => {
			this.data.showPreview = previewCheckbox.checked;
		});
	}

	_savePreview() {
		return {
			language: this.data.language,
			title: this.data.title,
			description: this.data.description,
			code: this.data.code,
			showPreview: this.data.showPreview,
		};
	}

	save() {
		return this._savePreview();
	}

	_escapeHtml(str) {
		if (!str) return '';
		const div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}

	_getLanguagesOptions(selected) {
		const languages = [
			'javascript',
			'typescript',
			'python',
			'java',
			'c++',
			'c#',
			'php',
			'ruby',
			'go',
			'rust',
			'swift',
			'kotlin',
			'scala',
			'dart',
			'html',
			'css',
			'sql',
			'bash',
			'powershell',
			'yaml',
			'json',
			'markdown',
			'xml',
			'dockerfile',
			'nginx',
		];

		return languages
			.map(
				(lang) =>
					`<option value="${lang}" ${
						lang === selected ? 'selected' : ''
					}>${this._formatLang(lang)}</option>`
			)
			.join('');
	}

	_formatLang(lang) {
		return lang
			.split('')
			.map((char, index) => (index === 0 ? char.toUpperCase() : char))
			.join('');
	}
}
