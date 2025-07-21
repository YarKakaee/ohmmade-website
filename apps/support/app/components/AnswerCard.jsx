'use client';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import DiscussionViewer from './DiscussionViewer';

export default function AnswerCard({ answer, index }) {
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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.1 }}
			className={`bg-[#1C1C20] border rounded-xl p-6 ${
				answer.isAccepted
					? 'border-[#35AC47]/30 bg-[#35AC47]/5'
					: 'border-white/10'
			}`}
		>
			{/* Answer Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					{answer.author?.image && (
						<img
							src={answer.author.image}
							alt={answer.author.name || 'Anonymous'}
							className="w-8 h-8 rounded-full"
						/>
					)}
					<div>
						<div className="flex items-center gap-2">
							<span className="text-white font-medium text-sm">
								{answer.author?.name || 'Anonymous'}
							</span>
							{answer.isAccepted && (
								<div className="flex items-center gap-1 bg-[#35AC47]/20 text-[#35AC47] px-2 py-1 rounded-full text-xs">
									<Check className="w-3 h-3" />
									Accepted
								</div>
							)}
						</div>
						<div className="flex items-center gap-1 text-white/40 text-xs">
							<Clock className="w-3 h-3" />
							{formatDate(answer.createdAt)}
						</div>
					</div>
				</div>
			</div>

			{/* Answer Content */}
			<div className="prose prose-invert max-w-none">
				<DiscussionViewer content={answer.content} />
			</div>
		</motion.div>
	);
}
