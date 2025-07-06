'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function ProjectCard({
	title,
	category,
	description,
	imageUrl,
	categoryColor,
	authorName,
	authorImage,
	authorEmail,
	views,
	likes,
	slug,
	variant = 'large',
	viewMode = 'grid',
}) {
	const isVerified = authorEmail === 'info@ohmmade.ca';

	const cardHeight = 'h-[380px]';
	const imageHeight = 'h-40 sm:h-44 md:h-48';
	const titleTextSize = 'text-[13px]';
	const descTextSize = 'text-[12px]';
	const padding = 'p-4';
	const avatarSize = 24;
	const divHeight = 'h-[calc(100%-240px)]';
	const categoryTextSize = 'text-[11px]';

	return (
		<Link href={`/projects/${slug}`}>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				viewport={{ once: true }}
				className={`bg-[#1C1C20] ${cardHeight} rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer`}
			>
				{/* Image */}
				<div
					className={`relative ${imageHeight} w-full overflow-hidden`}
				>
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
					/>
				</div>

				{/* Content */}
				<div
					className={`${padding} space-y-3 ${divHeight} flex flex-col`}
				>
					<div className="flex justify-between">
						<h3 className={`text-white font-bold ${titleTextSize}`}>
							{title}
						</h3>
						<div className="flex items-center gap-3 text-[11px] text-white/60">
							<div className="flex items-center gap-1">
								<FontAwesomeIcon
									icon={faEye}
									className="text-[#FFFFFF]/40"
								/>
								{views}
							</div>
							<div className="flex items-center gap-1">
								<FontAwesomeIcon
									icon={faHeart}
									className="text-[#e22043]"
								/>
								{likes}
							</div>
						</div>
					</div>

					<p
						className={`text-[#FFFFFF]/60 ${descTextSize} leading-relaxed`}
					>
						{description}
					</p>

					<div className="border-t border-[#2E2E30] pt-3 mt-auto flex items-center justify-between text-[#FFFFFF]/60 text-xs">
						<div className="flex items-center gap-2">
							{authorImage ? (
								<Image
									src={authorImage}
									alt={authorName || 'Author'}
									width={avatarSize}
									height={avatarSize}
									className={`rounded-full object-cover h-[24px] w-[24px] overflow-hidden`}
								/>
							) : (
								<div
									className={`w-[24px] h-[24px] rounded-full bg-[#343437] flex items-center justify-center text-white text-[11px] font-bold`}
								>
									{authorName?.[0]?.toUpperCase() || 'U'}
								</div>
							)}
							<span
								className={`text-white/60 ${categoryTextSize} flex items-center gap-1`}
							>
								{authorName || 'Unknown'}
								{isVerified && (
									<VerifiedIcon
										fontSize="xs"
										className="ml-0.5"
									/>
								)}
							</span>
						</div>
						<span
							className={`${categoryTextSize} font-medium px-3 py-1 rounded-full text-white w-fit`}
							style={{ backgroundColor: categoryColor }}
						>
							{category}
						</span>
					</div>
				</div>
			</motion.div>
		</Link>
	);
}
