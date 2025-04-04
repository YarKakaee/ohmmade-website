export default class CustomCodeSnippet {
	constructor({ data, api }) {
		this.api = api;
		this.data = {
			language: data.language || 'cpp',
			title: data.title || '',
			description: data.description || '',
			code: data.code || '',
			showPreview: data.showPreview || false,
		};
		this.wrapper = undefined;
	}

	static get toolbox() {
		return {
			title: 'Code',
			icon: `<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 13l-4-4 4-4m4 8l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd"/></svg>`,
		};
	}

	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.className = 'w-full relative';

		this.wrapper.innerHTML = `
			<div class="snippet-form ${this.data.showPreview ? 'hidden' : ''}">
				<label class="block text-white/60 text-sm font-medium relative">
					Type <span class="text-[#FFC008]">*</span>
					<div class="relative mt-2">
						<select class="snippet-language cursor-pointer w-full border border-[#6B6B6D] appearance-none rounded-md px-3 py-2 pr-10 text-white/70 bg-[#1C1C20] focus:outline-none focus:ring-2 focus:ring-[#27BBFF] font-medium text-sm">
							${this._getLanguagesOptions(this.data.language)}
						</select>
						
					</div>
				</label>

				<label class="block mt-4 text-white/60 text-sm font-medium">
					Title
					<input type="text" class="snippet-title mt-2 block w-full bg-[#1C1C20] text-white border border-gray-600 rounded-md px-3 py-2" value="${
						this.data.title
					}">
				</label>

				<label class="block mt-4 text-white/60 text-sm font-medium">
					Snippet code <span class="text-[#FFC008]">*</span>
					<textarea rows="10" class="resize-none snippet-code mt-2 block w-full bg-[#1C1C20] text-white border border-gray-600 rounded-md px-3 py-2">${
						this.data.code
					}</textarea>
				</label>

				<label class="block mt-4 text-white/60 text-sm font-medium">
					Description
					<textarea rows="2" class="resize-none snippet-description mt-2 block w-full bg-[#1C1C20] text-white border border-gray-600 rounded-md px-3 py-2">${
						this.data.description
					}</textarea>
				</label>

				<div class="mt-4 flex gap-3 mb-4">
					<button class="cursor-pointer btn-save bg-[#27BBFF] text-[#101014] px-4 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition">Save</button>
				</div>
			</div>

			<div class="snippet-preview ${this.data.showPreview ? '' : 'hidden'}">
				<div class="rounded-xl bg-[#18181C] p-4 mb-4 border border-white/10">
					<div class="flex items-center gap-4 mb-4">
						<span class="lang-badge inline-block text-xs font-semibold bg-[#303034] text-white px-2 py-1 rounded">${this._formatLang(
							this.data.language
						)}</span>
						<p class="preview-title text-white font-black text-xl">${this.data.title}</p>
					</div>

					<pre class="text-white whitespace-pre-wrap overflow-auto mb-4"><code>${
						this.data.code
					}</code></pre>

					<p class="preview-desc text-white/70 text-sm">${this.data.description}</p>
				</div>
				
			</div>
		`;

		this.wrapper
			.querySelector('.btn-save')
			?.addEventListener('click', () => this._savePreview());
		this.wrapper
			.querySelector('.btn-cancel')
			?.addEventListener('click', () => this._cancel());

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

		const form = this.wrapper.querySelector('.snippet-form');
		const preview = this.wrapper.querySelector('.snippet-preview');

		if (form && preview) {
			form.classList.add('hidden');
			preview.classList.remove('hidden');

			// Update content
			preview.querySelector('.lang-badge').textContent = this._formatLang(
				this.data.language
			);
			preview.querySelector('.preview-title').textContent =
				this.data.title;
			preview.querySelector('pre code').textContent = this.data.code;
			preview.querySelector('.preview-desc').textContent =
				this.data.description;
		}
	}

	_cancel() {
		this.data.showPreview = false;
		const form = this.wrapper.querySelector('.snippet-form');
		const preview = this.wrapper.querySelector('.snippet-preview');

		if (form && preview) {
			form.classList.remove('hidden');
			preview.classList.add('hidden');
		}
	}

	save() {
		return this.data;
	}

	_getLanguagesOptions(selected) {
		const langs = [
			'c++',
			'python',
			'shell',
			'java',
			'JavaScript',
			'c#',
			'console_output',
			'c',
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
		return lang.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}
}
