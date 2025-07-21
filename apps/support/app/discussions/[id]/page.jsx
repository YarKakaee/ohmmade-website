'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Eye, Clock, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import LayoutContainer from '@ohmmade/ui/layout-container';
import DiscussionViewer from '../../components/DiscussionViewer';
import PostAnswer from '../../components/PostAnswer';
import AnswerCard from '../../components/AnswerCard';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useAuthModal } from '@ohmmade/providers';

export default function DiscussionPage() {
	const params = useParams();
	const router = useRouter();
	const { session } = useSessionContext();
	const { openAuthModal } = useAuthModal();
	const [discussion, setDiscussion] = useState(null);
	const [answers, setAnswers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingAnswers, setLoadingAnswers] = useState(false);
	const [error, setError] = useState(null);
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);

	// Fetch discussion data
	useEffect(() => {
		const fetchDiscussion = async () => {
			if (!params.id) return;

			setLoading(true);
			try {
				const response = await fetch(`/api/discussions/${params.id}`);
				if (!response.ok) {
					throw new Error('Discussion not found');
				}
				const data = await response.json();
				setDiscussion(data);
			} catch (error) {
				console.error('Error fetching discussion:', error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchDiscussion();
	}, [params.id]);

	// Fetch answers
	useEffect(() => {
		const fetchAnswers = async () => {
			if (!params.id) return;

			setLoadingAnswers(true);
			try {
				const response = await fetch(
					`/api/discussions/${params.id}/answers`
				);
				if (response.ok) {
					const data = await response.json();
					setAnswers(data);
				}
			} catch (error) {
				console.error('Error fetching answers:', error);
			} finally {
				setLoadingAnswers(false);
			}
		};

		fetchAnswers();
	}, [params.id]);

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Handle post answer
	const handlePostAnswer = () => {
		if (!session) {
			openAuthModal();
		} else {
			setIsPostModalOpen(true);
		}
	};

	// Handle answer success
	const handleAnswerSuccess = (newAnswer) => {
		setAnswers((prev) => [...prev, newAnswer]);
		setIsPostModalOpen(false);
		// Refresh discussion to update status and answer count
		window.location.reload();
	};

	if (loading) {
		return (
			<section className="relative z-10 bg-[#101014] min-h-screen">
				<LayoutContainer>
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="text-white/60">
							Loading discussion...
						</div>
					</div>
				</LayoutContainer>
			</section>
		);
	}

	if (error || !discussion) {
		return (
			<section className="relative z-10 bg-[#101014] min-h-screen">
				<LayoutContainer>
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="text-center space-y-4">
							<div className="text-white/60 text-lg">
								{error || 'Discussion not found'}
							</div>
							<button
								onClick={() => router.push('/')}
								className="bg-[#35AC47] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#35AC47]/90 transition-colors duration-200 cursor-pointer"
							>
								Back to Home
							</button>
						</div>
					</div>
				</LayoutContainer>
			</section>
		);
	}

	return (
		<section className="relative z-10 bg-[#101014] min-h-screen pt-24">
			<LayoutContainer>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-8 pt-8"
				>
					{/* Back Button */}
					<button
						onClick={() => router.push('/')}
						className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</button>

					{/* Discussion Header */}
					<div className="bg-[#1C1C20] border border-white/10 rounded-xl p-6">
						<div className="flex items-start justify-between mb-4">
							<div
								className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
									discussion.status === 'answered'
										? 'bg-[#35AC47]/20 text-[#35AC47] border border-[#35AC47]/30'
										: 'bg-white/10 text-white/60 border border-white/20'
								}`}
							>
								{discussion.status === 'answered' ? (
									<Check className="w-3 h-3" />
								) : (
									<MessageCircle className="w-3 h-3" />
								)}
								{discussion.status === 'answered'
									? 'Answered'
									: 'Open'}
							</div>
							<div className="flex items-center gap-4 text-xs text-white/50">
								<div className="flex items-center gap-1">
									<Eye className="w-3 h-3" />
									{discussion.views}
								</div>
								<div className="flex items-center gap-1">
									<MessageCircle className="w-3 h-3" />
									{answers.length}
								</div>
							</div>
						</div>

						<h1 className="text-3xl font-bold text-white mb-4">
							{discussion.title}
						</h1>

						<div className="flex items-center gap-2 mb-4">
							{discussion.author?.image && (
								<img
									src={discussion.author.image}
									alt={discussion.author.name || 'Anonymous'}
									className="w-6 h-6 rounded-full"
								/>
							)}
							<span className="text-white/60 text-sm">
								{discussion.author?.name || 'Anonymous'}
							</span>
							<span className="text-white/40">•</span>
							<span className="text-white/40 text-sm">
								{formatDate(discussion.createdAt)}
							</span>
						</div>

						{discussion.tags && discussion.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{discussion.tags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-1 bg-[#35AC47]/20 text-[#35AC47] px-3 py-1 rounded-full text-sm"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>

					{/* Discussion Content */}
					<div className="bg-[#1C1C20] border border-white/10 rounded-xl p-6">
						<DiscussionViewer content={discussion.content} />
					</div>

					{/* Answers Section */}
					<div className="bg-[#1C1C20] border border-white/10 rounded-xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-white">
								Answers ({answers.length})
							</h2>
							<button
								onClick={handlePostAnswer}
								className="bg-[#35AC47] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#35AC47]/90 transition-colors duration-200 cursor-pointer"
							>
								Post Answer
							</button>
						</div>

						{loadingAnswers ? (
							<div className="text-center py-8">
								<div className="text-white/60">
									Loading answers...
								</div>
							</div>
						) : answers.length > 0 ? (
							<div className="space-y-4">
								{answers.map((answer, index) => (
									<AnswerCard
										key={answer.id}
										answer={answer}
										index={index}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<div className="text-white/40 text-lg mb-4">
									No answers yet
								</div>
								<p className="text-white/60 text-sm">
									Be the first to help by posting an answer!
								</p>
							</div>
						)}
					</div>
				</motion.div>
			</LayoutContainer>

			{/* Post Answer Modal */}
			<PostAnswer
				isOpen={isPostModalOpen}
				onClose={() => setIsPostModalOpen(false)}
				onSuccess={handleAnswerSuccess}
				discussionId={params.id}
			/>
		</section>
	);
}
