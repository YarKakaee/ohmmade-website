'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Eye, Clock } from 'lucide-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import LayoutContainer from '@ohmmade/ui/layout-container';
import PostDiscussion from './PostDiscussion';
import { useAuthModal } from '@ohmmade/providers';

const SearchResultCard = ({ result, searchQuery, onClick }) => {
	// Highlight matching words in the title
	const highlightText = (text, query) => {
		if (!query) return text;
		const regex = new RegExp(`(${query})`, 'gi');
		const parts = text.split(regex);
		return parts.map((part, index) =>
			regex.test(part) ? (
				<span key={index} className="font-bold text-[#35AC47]">
					{part}
				</span>
			) : (
				part
			)
		);
	};

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

		if (diffInHours < 1) return 'Just now';
		if (diffInHours < 24) return `${diffInHours}h ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return date.toLocaleDateString();
	};

	// Get preview text from content
	const getPreviewText = (content) => {
		if (!content || !content.blocks) return '';

		const textBlocks = content.blocks
			.filter((block) => block.type === 'paragraph')
			.map((block) => block.data.text)
			.join(' ');

		return textBlocks.length > 120
			? `${textBlocks.substring(0, 120)}...`
			: textBlocks;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			onClick={() => onClick(result)}
			className="group bg-[#1C1C20] border border-white/10 rounded-xl p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer"
		>
			<div className="flex items-start justify-between mb-3">
				{/* Status Tag */}
				<div
					className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
						result.status === 'answered'
							? 'bg-[#35AC47]/20 text-[#35AC47] border border-[#35AC47]/30'
							: 'bg-white/10 text-white/60 border border-white/20'
					}`}
				>
					{result.status === 'answered' ? (
						<Check className="w-3 h-3" />
					) : (
						<MessageCircle className="w-3 h-3" />
					)}
					{result.status === 'answered' ? 'Answered' : 'Open'}
				</div>

				{/* Meta info */}
				<div className="flex items-center gap-4 text-xs text-white/50">
					<div className="flex items-center gap-1">
						<Eye className="w-3 h-3" />
						{result.views}
					</div>
					<div className="flex items-center gap-1">
						<MessageCircle className="w-3 h-3" />
						{result._count?.answers || 0}
					</div>
					<div className="flex items-center gap-1">
						<Clock className="w-3 h-3" />
						{formatDate(result.createdAt)}
					</div>
				</div>
			</div>

			{/* Question Title */}
			<h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-200">
				{highlightText(result.title, searchQuery)}
			</h3>

			{/* Question Preview */}
			<p className="text-white/60 text-sm leading-relaxed mb-3">
				{getPreviewText(result.content)}
			</p>

			{/* Author */}
			<div className="flex items-center gap-2">
				{result.author?.image && (
					<img
						src={result.author.image}
						alt={result.author.name || 'Anonymous'}
						className="w-5 h-5 rounded-full"
					/>
				)}
				<span className="text-white/60 text-xs">
					{result.author?.name || 'Anonymous'}
				</span>
			</div>

			{/* Tags */}
			{result.tags && result.tags.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-3">
					{result.tags.slice(0, 3).map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center gap-1 bg-[#35AC47]/20 text-[#35AC47] px-2 py-1 rounded-full text-xs"
						>
							{tag}
						</span>
					))}
					{result.tags.length > 3 && (
						<span className="text-white/40 text-xs">
							+{result.tags.length - 3} more
						</span>
					)}
				</div>
			)}
		</motion.div>
	);
};

export default function SearchResults({ results, searchQuery, isVisible }) {
	const { session } = useSessionContext();
	const { openAuthModal } = useAuthModal();
	const router = useRouter();
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const [discussions, setDiscussions] = useState([]);
	const [loading, setLoading] = useState(false);

	// Fetch discussions when search query changes
	useEffect(() => {
		if (!isVisible || !searchQuery) return;

		const fetchDiscussions = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`/api/discussions?q=${encodeURIComponent(searchQuery)}`
				);
				const data = await response.json();
				setDiscussions(data.discussions || []);
			} catch (error) {
				console.error('Error fetching discussions:', error);
				setDiscussions([]);
			} finally {
				setLoading(false);
			}
		};

		fetchDiscussions();
	}, [searchQuery, isVisible]);

	const handleDiscussionClick = (discussion) => {
		router.push(`/discussions/${discussion.id}`);
	};

	const handlePostQuestion = () => {
		if (!session) {
			openAuthModal();
		} else {
			setIsPostModalOpen(true);
		}
	};

	if (!isVisible) return null;

	return (
		<section id="search-results" className="relative z-10 bg-[#101014]">
			<LayoutContainer>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-8 pt-8"
				>
					{/* Header */}
					<div className="text-center">
						<h2 className="text-2xl font-bold text-white mb-2">
							Search Results
						</h2>
						<p className="text-white/60">
							{loading
								? 'Searching...'
								: `Found ${discussions.length} result${discussions.length !== 1 ? 's' : ''} for "${searchQuery}"`}
						</p>
					</div>
					{/* Search Results */}
					<>
						{loading ? (
							<div className="text-center py-12">
								<div className="text-white/60">
									Loading discussions...
								</div>
							</div>
						) : discussions.length > 0 ? (
							<div className="space-y-16">
								<div className="grid gap-4 max-w-4xl mx-auto">
									{discussions.map((discussion, index) => (
										<SearchResultCard
											key={discussion.id}
											result={discussion}
											searchQuery={searchQuery}
											onClick={handleDiscussionClick}
										/>
									))}
								</div>

								{/* Post Question Option */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: 0.3,
									}}
									className="text-center pt-8 border-t border-white/10"
								>
									<p className="text-white/60 mb-6">
										Didn't find what you're looking for?
									</p>
									<motion.button
										onClick={handlePostQuestion}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="bg-[#35AC47] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#35AC47]/90 transition-colors duration-200 mb-16 cursor-pointer"
									>
										Post a Question
									</motion.button>
								</motion.div>
							</div>
						) : (
							/* No Results */
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="text-center max-w-md mx-auto space-y-6 pb-16"
							>
								<div className="text-white/40 text-lg">
									No results found for "{searchQuery}"
								</div>
								<motion.button
									onClick={handlePostQuestion}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="bg-[#35AC47] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#35AC47]/90 transition-colors duration-200 cursor-pointer"
								>
									Post a Question Instead
								</motion.button>
							</motion.div>
						)}
					</>
				</motion.div>
			</LayoutContainer>

			{/* Post Discussion Modal */}
			<PostDiscussion
				isOpen={isPostModalOpen}
				onClose={() => setIsPostModalOpen(false)}
				onSuccess={(discussion) => {
					// Refresh discussions after posting
					setDiscussions((prev) => [discussion, ...prev]);
					setIsPostModalOpen(false);
				}}
			/>
		</section>
	);
}
