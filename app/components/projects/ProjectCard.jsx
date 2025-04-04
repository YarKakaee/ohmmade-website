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
}) {
	const isVerified = authorEmail === 'info@ohmmade.ca';

	return (
		<Link href={`/projects/${slug}`}>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				viewport={{ once: true }}
				className="bg-[#1C1C20] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group h-[465px] cursor-pointer"
			>
				{/* Image with zoom on hover */}
				<div className="relative h-48 sm:h-52 md:h-56 lg:h-60 w-full overflow-hidden">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
					/>
				</div>

				{/* Content */}
				<div className="p-5 space-y-3 h-[calc(100%-240px)] flex flex-col">
					{/* Title + Category */}
					<div className="flex justify-between">
						<h3 className="text-white font-bold text-[16px]">
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

					{/* Description */}
					<p className="text-[#FFFFFF]/60 text-[14px] leading-relaxed">
						{description}
					</p>

					{/* Footer */}
					<div className="border-t border-[#2E2E30] pt-3 mt-auto flex items-center justify-between text-[#FFFFFF]/60 text-xs">
						<div className="flex items-center gap-2">
							{authorImage ? (
								<Image
									src={authorImage}
									alt={authorName || 'Author'}
									width={24}
									height={24}
									className="rounded-full object-cover"
								/>
							) : (
								<div className="w-6 h-6 rounded-full bg-[#343437] flex items-center justify-center text-white text-xs font-bold">
									{authorName?.[0]?.toUpperCase() || 'U'}
								</div>
							)}
							<span className="text-white/60 text-xs flex items-center gap-1">
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
							className="text-xs font-medium px-3 py-1 rounded-full text-white w-fit"
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
