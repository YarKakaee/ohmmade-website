'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faTag } from '@fortawesome/free-solid-svg-icons';
import { CodexEditorWrapper } from '@ohmmade/ui';
import { useSessionContext } from '@supabase/auth-helpers-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostDiscussion({ isOpen, onClose, onSuccess }) {
	const { session } = useSessionContext();
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const editorRef = useRef(null);
	const tagInputRef = useRef(null);

	const MAX_TITLE_LENGTH = 200;
	const MAX_TAGS = 5;

	const handleAddTag = () => {
		if (!newTag.trim() || tags.length >= MAX_TAGS) return;
		const trimmedTag = newTag.trim().toLowerCase();
		if (!tags.includes(trimmedTag)) {
			setTags([...tags, trimmedTag]);
		}
		setNewTag('');
	};

	const handleRemoveTag = (index) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTag();
		}
	};

	const handleSubmit = async () => {
		if (!title.trim()) {
			toast.error('Please enter a title');
			return;
		}

		if (!editorRef.current) {
			toast.error('Editor not ready');
			return;
		}

		try {
			setIsSubmitting(true);
			const editorData = await editorRef.current.save();

			// Check if editor has content
			if (
				!editorData ||
				!editorData.blocks ||
				editorData.blocks.length === 0
			) {
				toast.error('Please add some content to your question');
				return;
			}

			const response = await axios.post('/api/discussions/create', {
				title: title.trim(),
				content: editorData,
				tags: tags,
			});

			if (response.data.success) {
				toast.success('Question posted successfully!');
				onSuccess?.(response.data.discussion);
				handleClose();
			}
		} catch (error) {
			console.error('Error posting discussion:', error);
			const message =
				error.response?.data?.error || 'Failed to post question';
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle backdrop and scrolling like AuthModal
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
		} else {
			document.removeEventListener('keydown', handleEscape);
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	const handleClose = () => {
		setTitle('');
		setTags([]);
		setNewTag('');
		if (editorRef.current) {
			editorRef.current.clear();
		}
		onClose();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 pt-38"
					onClick={handleClose}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{
							opacity: 1,
							scale: 1,
							y: 0,
							transition: {
								type: 'spring',
								duration: 0.5,
								bounce: 0.3,
							},
						}}
						exit={{
							opacity: 0,
							scale: 0.95,
							y: 10,
							transition: {
								duration: 0.2,
							},
						}}
						className="bg-[#101014]/60 backdrop-blur-lg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#3A3A3C]/60 shadow-xl relative"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-[#3A3A3C]/60">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-[#35AC47] rounded-lg flex items-center justify-center">
									<FontAwesomeIcon
										icon={faTag}
										className="text-white text-sm"
									/>
								</div>
								<div>
									<h2 className="text-xl font-bold text-white">
										Post a Question
									</h2>
									<p className="text-[#FFFFFF]/60 text-sm">
										Get Help from the community
									</p>
								</div>
							</div>
							<button
								onClick={handleClose}
								className="text-[#FFFFFF]/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
							>
								<FontAwesomeIcon icon={faTimes} size="lg" />
							</button>
						</div>

						{/* Content */}
						<div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
							{/* Title */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-[#ACACAD]">
									Question Title{' '}
									<span className="text-[#FFC008]">*</span>
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) =>
										setTitle(
											e.target.value.slice(
												0,
												MAX_TITLE_LENGTH
											)
										)
									}
									placeholder="What's your question? Be specific..."
									className="w-full pl-4 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#35AC47] focus:border-transparent placeholder:text-sm transition-all"
								/>
								<p className="text-xs text-[#ACACAD] mt-1">
									{title.length}/{MAX_TITLE_LENGTH} characters
								</p>
							</div>

							{/* Tags */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-[#ACACAD]">
									Tags{' '}
									<span className="text-[#ACACAD]/60">
										(optional)
									</span>
								</label>
								<div className="flex gap-2 mb-2">
									<input
										ref={tagInputRef}
										type="text"
										value={newTag}
										onChange={(e) =>
											setNewTag(e.target.value)
										}
										onKeyPress={handleKeyPress}
										placeholder="e.g., arduino, electronics, troubleshooting"
										className="flex-1 pl-4 pr-4 py-2 bg-white/5 backdrop-blur-xl border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#35AC47] focus:border-transparent placeholder:text-sm transition-all"
									/>
									<motion.button
										onClick={handleAddTag}
										disabled={tags.length >= MAX_TAGS}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className={`px-4 py-2 rounded-lg font-medium transition ${
											tags.length >= MAX_TAGS
												? 'bg-[#35AC47]/50 text-white/50 cursor-not-allowed'
												: 'bg-[#35AC47] text-white hover:bg-[#35AC47]/90 cursor-pointer'
										}`}
									>
										Add
									</motion.button>
								</div>
								{tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag, index) => (
											<motion.span
												key={index}
												initial={{
													opacity: 0,
													scale: 0.8,
												}}
												animate={{
													opacity: 1,
													scale: 1,
												}}
												className="inline-flex items-center gap-2 bg-[#35AC47]/20 text-[#35AC47] px-3 py-1 rounded-full text-sm border border-[#35AC47]/30"
											>
												<FontAwesomeIcon
													icon={faTag}
													className="text-xs"
												/>
												{tag}
												<button
													onClick={() =>
														handleRemoveTag(index)
													}
													className="ml-1 hover:text-white transition-colors p-0.5 rounded-full hover:bg-[#35AC47]/20"
												>
													<FontAwesomeIcon
														icon={faTimes}
														className="text-xs"
													/>
												</button>
											</motion.span>
										))}
									</div>
								)}
								<p className="text-xs text-[#ACACAD] mt-1">
									{tags.length}/{MAX_TAGS} tags
								</p>
							</div>

							{/* Editor */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-[#ACACAD]">
									Question Details{' '}
									<span className="text-[#FFC008]">*</span>
								</label>
								<div className="border border-[#3A3A3C]/60 rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl">
									<div className="h-[200px] overflow-y-auto">
										<CodexEditorWrapper ref={editorRef} />
									</div>
								</div>
								<p className="text-xs text-[#ACACAD] mt-2">
									Use the editor to format your question with
									text, code blocks, and images
								</p>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-end gap-3 p-6 border-t border-[#3A3A3C]/60">
							<motion.button
								onClick={handleClose}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="px-6 py-2 text-[#ACACAD] hover:text-white transition-colors"
							>
								Cancel
							</motion.button>
							<motion.button
								onClick={handleSubmit}
								disabled={isSubmitting || !title.trim()}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`px-6 py-2 rounded-lg font-medium transition ${
									isSubmitting || !title.trim()
										? 'bg-[#35AC47]/50 text-white/50 cursor-not-allowed'
										: 'bg-[#35AC47] text-white hover:bg-[#35AC47]/90 cursor-pointer shadow-lg shadow-[#35AC47]/20'
								}`}
							>
								{isSubmitting ? (
									<>
										<FontAwesomeIcon
											icon={faSpinner}
											spin
											className="mr-2"
										/>
										Posting...
									</>
								) : (
									'Post Question'
								)}
							</motion.button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
