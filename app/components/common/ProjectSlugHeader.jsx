'use client';

import ClientVerifiedIcon from '@/app/components/auth/ClientVerifiedIcon';
import categoryColors from '@/lib/constants/categoryColors';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import {
	faEye,
	faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProjectSlugHeader({ project }) {
	const [likesCount, setLikesCount] = useState(project.likes);

	useEffect(() => {
		const trackView = async () => {
			try {
				await axios.post(`/api/projects/${project.slug}/view`);
			} catch (err) {
				console.error('Error tracking view:', err);
			}
		};
		trackView();
		const checkLiked = async () => {
			try {
				const res = await axios.get(
					`/api/projects/${project.slug}/liked`
				);
				setLiked(res.data.liked);
			} catch (err) {
				console.error('Failed to check like status:', err);
			}
		};
		checkLiked();
	}, [project.slug]);

	const toggleLike = async () => {
		const newLikedState = !liked;
		setLiked(newLikedState); // optimistic update
		setLikesCount((prev) => prev + (newLikedState ? 1 : -1)); // update count immediately

		try {
			const res = await axios.post(`/api/projects/${project.slug}/like`);
			setLiked(res.data.liked); // make sure it reflects real result
			setLikesCount(
				(prev) =>
					prev + (res.data.liked ? 1 : -1) - (newLikedState ? 1 : -1)
			); // correct if server result differs
		} catch (err) {
			console.error('Error liking project:', err);
			// revert on error
			setLiked(!newLikedState);
			setLikesCount((prev) => prev - (newLikedState ? 1 : -1));
		}
	};

	const [liked, setLiked] = useState(false);

	const isVerified = project.author?.email === 'info@ohmmade.ca';

	const formattedDate = new Date(project.createdAt).toLocaleDateString(
		'en-US',
		{ month: 'short', day: '2-digit', year: 'numeric' }
	);

	const updatedDate = new Date(project.updatedAt).toLocaleDateString(
		'en-US',
		{ month: 'short', day: '2-digit', year: 'numeric' }
	);

	return (
		<section className="relative w-full min-h-[90vh] flex items-center justify-center px-8 sm:px-16 lg:px-24 mt-10">
			<div className="mx-auto max-w-[1700px] px-8 sm:px-16 flex items-center justify-between w-full">
				{/* Left: Info */}
				<div className="w-full lg:w-1/2 space-y-5">
					{/* Badges */}
					<div className="flex flex-wrap gap-3">
						<span className="bg-[#9224CA] text-white text-xs font-semibold px-3 py-1 rounded-full">
							Projects
						</span>
						<span
							className="text-white text-xs font-semibold px-3 py-1 rounded-full"
							style={{
								backgroundColor:
									categoryColors[project.category] ||
									'#363636',
							}}
						>
							{project.category}
						</span>
					</div>

					{/* Date */}
					<p className="text-white/60 text-sm">
						{formattedDate} • Last Updated:{' '}
						<span className="text-white font-medium">
							{updatedDate}
						</span>
					</p>

					{/* Title */}
					<h1 className="text-white text-[32px] sm:text-[38px] font-extrabold leading-tight">
						{project.title}
					</h1>

					{/* Description */}
					<p className="text-white/70 text-sm sm:text-base max-w-[670px]">
						{project.description}
					</p>

					{/* Author and Stats */}
					<div className="mt-2 text-white/70 text-sm">
						<span className="flex items-center gap-1">
							by{' '}
							<span className="text-white font-medium flex items-center gap-1">
								{project.author?.name || 'Unknown'}
								{isVerified && (
									<span className="text-[#27BBFF] mb-0.5">
										<ClientVerifiedIcon />
									</span>
								)}
							</span>
						</span>
					</div>

					<div className="flex -mt-2 text-white/70 text-sm gap-4">
						<span className="flex items-center gap-2">
							<FontAwesomeIcon icon={faEye} />
							{project.views}{' '}
							{project.views === 1 ? 'View' : 'Views'}
						</span>
						<motion.button
							onClick={toggleLike}
							className="flex items-center gap-2 transition-colors duration-200 cursor-pointer hover:bg-[#343437] rounded-md px-3 py-2"
							whileTap={{ scale: 0.9 }}
						>
							<motion.span
								key={liked ? 'liked' : 'unliked'} // re-trigger animation on state change
								initial={{ scale: 1 }}
								animate={{ scale: [1.2, 1] }}
								transition={{ duration: 0.2 }}
							>
								<FontAwesomeIcon
									icon={liked ? solidHeart : regularHeart}
									className={`${
										liked
											? 'text-[#E91E3E]'
											: 'text-white/70'
									} transition-colors duration-75`}
								/>
							</motion.span>
							<span>{likesCount}</span>
						</motion.button>
					</div>
				</div>
				{/* Right: Thumbnail */}
				<div className="flex-shrink-0">
					<div className="relative w-[760px] h-[480px] rounded-lg overflow-hidden border border-white/10 shadow-lg">
						<Image
							src={project.thumbnailUrl}
							alt={project.title}
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 700px"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
