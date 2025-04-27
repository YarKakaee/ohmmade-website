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
	const isSmall = variant === 'small';
	const isList = viewMode === 'list';

	const cardHeight = isList
		? 'h-[180px]'
		: isSmall
		? 'h-[360px]'
		: 'h-[465px]';
	const imageHeight = isList
		? 'h-[180px] w-[300px]'
		: isSmall
		? 'h-36 sm:h-32 md:h-36 lg:h-44'
		: 'h-48 sm:h-52 md:h-56 lg:h-60';
	const titleTextSize = isList
		? 'text-[18px]'
		: isSmall
		? 'text-[12.5px]'
		: 'text-[16.5px]';
	const descTextSize = isList
		? 'text-[14px]'
		: isSmall
		? 'text-[11px]'
		: 'text-[14px]';
	const padding = isList ? 'p-6' : isSmall ? 'p-4' : 'p-5';
	const avatarSize = isList ? 28 : isSmall ? 20 : 24;
	const divHeight = isList
		? 'h-full'
		: isSmall
		? 'h-[calc(100%-178px)]'
		: 'h-[calc(100%-240px)]';
	const categoryTextSize = isList
		? 'text-[13px]'
		: isSmall
		? 'text-[10px]'
		: 'text-[13px]';

	return (
		<Link href={`/projects/${slug}`}>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				viewport={{ once: true }}
				className={`bg-[#1C1C20] ${cardHeight} rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer ${
					isList ? 'flex' : ''
				}`}
			>
				{/* Image */}
				<div
					className={`relative ${imageHeight} ${
						isList ? 'flex-shrink-0' : 'w-full'
					} overflow-hidden`}
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
					className={`${padding} space-y-3 ${divHeight} flex flex-col ${
						isList ? 'flex-1' : ''
					}`}
				>
					<div className="flex justify-between">
						<h3 className={`text-white font-bold ${titleTextSize}`}>
							{title}
						</h3>
						<div className="flex items-center gap-3 text-xs text-white/60">
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
						className={`text-[#FFFFFF]/60 ${descTextSize} leading-relaxed ${
							isList ? 'line-clamp-2' : ''
						}`}
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
									className="rounded-full object-cover"
								/>
							) : (
								<div
									className={`w-[${avatarSize}px] h-[${avatarSize}px] rounded-full bg-[#343437] flex items-center justify-center text-white text-[11px] font-bold`}
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
