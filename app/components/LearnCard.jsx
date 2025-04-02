'use client'; // For Next.js App Router with client components

import Image from 'next/image';
import Link from 'next/link';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LearnCard({ title, image, link, icon }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				ease: 'easeOut',
			}}
			viewport={{ once: true }}
		>
			<Link href={link} passHref>
				<motion.div className="relative group w-full h-[240px] sm:h-[280px] lg:h-[230px] overflow-hidden rounded-xl cursor-pointer shadow-lg">
					{/* Card Image with Zoom Effect */}
					<motion.div className="absolute inset-0 w-full h-full z-0 transition-transform duration-500 group-hover:scale-110">
						<Image
							src={image}
							alt={title}
							layout="fill"
							objectFit="cover"
							className="rounded-xl"
						/>
						{/* Overlay Effect */}
						<div className="absolute inset-0 bg-black/40 group-hover:bg-black/45 transition duration-300"></div>
					</motion.div>

					{/* Card Text with Group Hover */}
					<div className="absolute bottom-5 left-5 z-10 transition-transform duration-300 group-hover:-translate-y-1">
						<h3 className="text-white text-lg font-extrabold flex items-center space-x-2">
							<span>{title}</span>
							<span>
								<FontAwesomeIcon
									icon={faCircleArrowRight}
									size="sm"
									className="ml-1.5 transform transition-transform duration-200"
								/>
							</span>
						</h3>
					</div>
				</motion.div>
			</Link>
		</motion.div>
	);
}
