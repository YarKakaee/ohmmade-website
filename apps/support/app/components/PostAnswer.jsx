'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CodexEditorWrapper } from '@ohmmade/ui';
import { useSessionContext } from '@supabase/auth-helpers-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostAnswer({
	isOpen,
	onClose,
	onSuccess,
	discussionId,
}) {
	const { session } = useSessionContext();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const editorRef = useRef(null);

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
		if (editorRef.current) {
			editorRef.current.clear();
		}
		onClose();
	};

	const handleSubmit = async () => {
		if (!session) {
			toast.error('You must be logged in to post an answer');
			return;
		}

		try {
			const content = await editorRef.current.save();
			if (!content || !content.blocks || content.blocks.length === 0) {
				toast.error('Please add some content to your answer');
				return;
			}

			setIsSubmitting(true);

			const response = await axios.post(
				`/api/discussions/${discussionId}/answers`,
				{
					content,
				}
			);

			toast.success('Answer posted successfully!');
			onSuccess(response.data);
		} catch (error) {
			console.error('Error posting answer:', error);
			const message =
				error.response?.data?.error || 'Failed to post answer';
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
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
										icon={faTimes}
										className="text-white text-sm"
									/>
								</div>
								<div>
									<h2 className="text-xl font-bold text-white">
										Post an Answer
									</h2>
									<p className="text-[#FFFFFF]/60 text-sm">
										Help others by providing a detailed
										answer
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
							{/* Editor */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-[#ACACAD]">
									Your Answer{' '}
									<span className="text-[#FFC008]">*</span>
								</label>
								<div className="border border-[#3A3A3C]/60 rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl">
									<div className="max-h-[300px] overflow-y-auto">
										<CodexEditorWrapper ref={editorRef} />
									</div>
								</div>
								<p className="text-xs text-[#ACACAD] mt-2">
									Use the editor to format your answer with
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
								disabled={isSubmitting}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`px-6 py-2 rounded-lg font-medium transition ${
									isSubmitting
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
									'Post Answer'
								)}
							</motion.button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
