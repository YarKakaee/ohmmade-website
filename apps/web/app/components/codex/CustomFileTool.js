export default class CustomFileTool {
	constructor({ data, api, readOnly }) {
		this.api = api;
		this.readOnly = readOnly;
		this.data = {
			file: data.file || null,
			title: data.title || '',
			...data,
		};
		this.wrapper = null;
		this.settings = [
			{
				name: 'withBorder',
				icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232H11.3v-2.138h2.25v-2.043h2.25zm1.9-8.85l-1.9-.387v3.57h-2.25V2.42L8.2 1.61 8.2 16.2h-2.25V4.13L3.3 5.27v2.9H1.05V5.27L2.95 3.95l5.5-1.3 5.5 1.3 1.9.387z"/></svg>`,
			},
		];
	}

	static get toolbox() {
		return {
			title: 'File',
			icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-67 49v36c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
		};
	}

	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('file-tool');

		if (this.readOnly && this.data.file) {
			this._renderFilePreview();
		} else if (!this.readOnly) {
			this._renderUploadForm();
		}

		return this.wrapper;
	}

	_renderFilePreview() {
		const fileExtension = this._getFileExtension(this.data.file.url);
		const fileIcon = this._getFileIcon(fileExtension);
		const fileSize = this._formatFileSize(this.data.file.size || 0);
		const fileName =
			this.data.title || this.data.file.name || 'Download File';

		this.wrapper.innerHTML = `
			<div class="file-preview-container">
				<div class="file-preview bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl p-6 hover:border-[#27BBFF]/50 transition-all duration-200 cursor-pointer group" onclick="window.open('${this.data.file.url}', '_blank')">
					<div class="flex items-center gap-4">
						<div class="file-icon w-12 h-12 bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
							${fileIcon}
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-white font-semibold text-lg mb-1 truncate group-hover:text-[#27BBFF] transition-colors duration-200">${fileName}</h3>
							<div class="flex items-center gap-3 text-white/60 text-sm">
								<span class="uppercase font-medium">${fileExtension}</span>
								${fileSize ? `<span>•</span><span>${fileSize}</span>` : ''}
							</div>
						</div>
						<div class="download-icon text-white/40 group-hover:text-[#27BBFF] transition-colors duration-200">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	_renderUploadForm() {
		this.wrapper.innerHTML = `
			<div class="file-upload-container">
				<div class="file-upload-form bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl p-6">
					${this.data.file ? this._getFilePreviewHtml() : this._getUploadAreaHtml()}
				</div>
			</div>
		`;

		this._attachEventListeners();
	}

	_getUploadAreaHtml() {
		return `
			<div class="upload-area border-2 border-dashed border-[#3A3A3C] hover:border-[#27BBFF] rounded-xl p-8 text-center cursor-pointer hover:bg-[#2C2F36]/50 transition-all duration-200 group">
				<div class="w-16 h-16 bg-[#2C2F36] group-hover:bg-[#27BBFF]/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-200">
					<svg class="w-8 h-8 text-white/60 group-hover:text-[#27BBFF] transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
					</svg>
				</div>
				<h3 class="text-white font-semibold text-lg mb-2 group-hover:text-white transition-colors duration-200">
					Upload a file
				</h3>
				<p class="text-white/60 group-hover:text-white/80 text-sm mb-4 transition-colors duration-200">
					Click to browse or drag and drop your file here
				</p>
				<p class="text-white/40 text-xs">
					Supports: ZIP, PDF, DOC, DOCX, XLS, XLSX, TXT, and more
				</p>
				<input type="file" class="file-input hidden" accept="*/*" />
			</div>
			<div class="file-title-input mt-4 hidden">
				<label class="block mb-2 text-white font-medium text-sm">File Title (optional)</label>
				<input type="text" class="w-full bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200" placeholder="Enter a custom title for this file..." />
			</div>
		`;
	}

	_getFilePreviewHtml() {
		const fileExtension = this._getFileExtension(this.data.file.url);
		const fileIcon = this._getFileIcon(fileExtension);
		const fileSize = this._formatFileSize(this.data.file.size || 0);
		const fileName =
			this.data.title || this.data.file.name || 'Uploaded File';

		return `
			<div class="file-preview-edit">
				<div class="flex items-center gap-4 p-4 bg-[#2C2F36] rounded-xl border border-[#3A3A3C]/60">
					<div class="file-icon w-10 h-10 bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] rounded-lg flex items-center justify-center">
						${fileIcon}
					</div>
					<div class="flex-1 min-w-0">
						<div class="text-white font-medium truncate">${this.data.file.name}</div>
						<div class="flex items-center gap-2 text-white/60 text-sm">
							<span class="uppercase font-medium">${fileExtension}</span>
							${fileSize ? `<span>•</span><span>${fileSize}</span>` : ''}
						</div>
					</div>
					<button class="remove-file text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-400/10">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
						</svg>
					</button>
				</div>
				<div class="file-title-input mt-4">
					<label class="block mb-2 text-white font-medium text-sm">File Title (optional)</label>
					<input type="text" class="file-title w-full bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200" placeholder="Enter a custom title for this file..." value="${fileName}" />
				</div>
			</div>
		`;
	}

	_attachEventListeners() {
		const uploadArea = this.wrapper.querySelector('.upload-area');
		const fileInput = this.wrapper.querySelector('.file-input');
		const removeBtn = this.wrapper.querySelector('.remove-file');
		const titleInput = this.wrapper.querySelector('.file-title');

		if (uploadArea && fileInput) {
			uploadArea.addEventListener('click', () => fileInput.click());

			uploadArea.addEventListener('dragover', (e) => {
				e.preventDefault();
				uploadArea.classList.add('border-[#27BBFF]', 'bg-[#27BBFF]/5');
			});

			uploadArea.addEventListener('dragleave', (e) => {
				e.preventDefault();
				uploadArea.classList.remove(
					'border-[#27BBFF]',
					'bg-[#27BBFF]/5'
				);
			});

			uploadArea.addEventListener('drop', (e) => {
				e.preventDefault();
				uploadArea.classList.remove(
					'border-[#27BBFF]',
					'bg-[#27BBFF]/5'
				);
				const files = e.dataTransfer.files;
				if (files.length > 0) {
					this._handleFileUpload(files[0]);
				}
			});

			fileInput.addEventListener('change', (e) => {
				if (e.target.files.length > 0) {
					this._handleFileUpload(e.target.files[0]);
				}
			});
		}

		if (removeBtn) {
			removeBtn.addEventListener('click', () => {
				this.data.file = null;
				this.data.title = '';
				this._renderUploadForm();
			});
		}

		if (titleInput) {
			titleInput.addEventListener('input', (e) => {
				this.data.title = e.target.value;
			});
		}
	}

	async _handleFileUpload(file) {
		const uploadArea = this.wrapper.querySelector('.upload-area');

		// Show loading state
		uploadArea.innerHTML = `
			<div class="flex items-center justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27BBFF]"></div>
				<span class="ml-3 text-white">Uploading ${file.name}...</span>
			</div>
		`;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/uploadFile', {
				method: 'POST',
				body: formData,
			});

			// Check if response is ok
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Check if response is JSON
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('Server response is not JSON');
			}

			const result = await response.json();

			if (result.success) {
				this.data.file = {
					url: result.file.url,
					name: file.name,
					size: file.size,
					type: file.type,
				};
				this.data.title = file.name.split('.')[0]; // Default title without extension
				this._renderUploadForm();

				// Show title input
				const titleInputContainer =
					this.wrapper.querySelector('.file-title-input');
				if (titleInputContainer) {
					titleInputContainer.classList.remove('hidden');
				}
			} else {
				throw new Error(result.message || 'Upload failed');
			}
		} catch (error) {
			console.error('File upload error:', error);
			uploadArea.innerHTML = `
				<div class="text-center py-8">
					<div class="text-red-400 mb-2">
						<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<p class="text-red-400 font-medium">Upload failed</p>
					<p class="text-white/60 text-sm mt-1">${error.message}</p>
					<button class="retry-upload mt-3 px-4 py-2 bg-[#27BBFF] text-white rounded-lg hover:bg-[#27BBFF]/80 transition-colors">
						Try Again
					</button>
				</div>
			`;

			const retryBtn = this.wrapper.querySelector('.retry-upload');
			if (retryBtn) {
				retryBtn.addEventListener('click', () => {
					this._renderUploadForm();
				});
			}
		}
	}

	_getFileExtension(url) {
		if (!url) return 'file';
		const extension = url.split('.').pop().toLowerCase();
		return extension || 'file';
	}

	_getFileIcon(extension) {
		const iconMap = {
			pdf: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6l-4-4H4v16zM9 13H7v-1h2v1zm4 0h-2v-1h2v1zm-4-2H7V9h2v2zm4 0h-2V9h2v2z"/></svg>',
			zip: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 0v2h2V4H5zm2 2v2h2V6H7zm0 2v2h2V8H7zm2 2v2h2v-2H9zm2-2v2h2V8h-2zm0-2v2h2V6h-2zm-2-2v2h2V4H9z"/></svg>',
			doc: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6l-4-4H4v16zm5-7v1H7V9h2v2zm2 0h2v4h-2V9z"/></svg>',
			docx: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6l-4-4H4v16zm5-7v1H7V9h2v2zm2 0h2v4h-2V9z"/></svg>',
			xls: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm2 2v2h2V5H5zm4 0v2h2V5H9zm4 0v2h2V5h-2zM5 9v2h2V9H5zm4 0v2h2V9H9zm4 0v2h2V9h-2z"/></svg>',
			xlsx: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm2 2v2h2V5H5zm4 0v2h2V5H9zm4 0v2h2V5h-2zM5 9v2h2V9H5zm4 0v2h2V9H9zm4 0v2h2V9h-2z"/></svg>',
			txt: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6l-4-4H4v16zm2-11h8v1H6V7zm0 2h8v1H6V9zm0 2h8v1H6v-1zm0 2h5v1H6v-1z"/></svg>',
		};

		return (
			iconMap[extension] ||
			'<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6l-4-4H4v16zm8-14v4h4l-4-4z"/></svg>'
		);
	}

	_formatFileSize(bytes) {
		if (bytes === 0) return '';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	save() {
		return this.data;
	}

	static get isReadOnlySupported() {
		return true;
	}
}
