'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function ProjectCard({
	title,
	category,
	description,
	imageUrl,
	categoryColor,
	author,
	views,
	likes,
	slug,
}) {
	return (
		<Link href={`/projects/${slug}`}>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				viewport={{ once: true }}
				className="bg-[#1C1C20] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group h-[460px] cursor-pointer"
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
					<div className="flex items-center justify-between">
						<h3 className="text-white font-bold text-lg">
							{title}
						</h3>
						<span
							className="text-xs font-medium px-3 py-1 rounded-full text-white"
							style={{ backgroundColor: categoryColor }}
						>
							{category}
						</span>
					</div>

					{/* Description */}
					<p className="text-[#A1A1AA] text-sm leading-relaxed">
						{description}
					</p>

					{/* Footer */}
					<div className="border-t border-[#2E2E30] pt-3 mt-auto flex items-center justify-between text-[#A1A1AA] text-xs">
						<span>By {author}</span>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1">
								<FontAwesomeIcon
									icon={faEye}
									className="text-[#7A7A7A]"
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
				</div>
			</motion.div>
		</Link>
	);
}
