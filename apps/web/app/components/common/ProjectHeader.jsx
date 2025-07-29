'use client';

import { Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function ProjectsHeader() {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={{
				visible: {
					transition: { staggerChildren: 0.15 },
				},
				hidden: {},
			}}
			className="flex flex-col sm:flex-row sm:justify-between mb-8 sm:mb-12 gap-6 sm:gap-0"
		>
			{/* Left: Title + Description */}
			<div className="flex-1">
				<motion.h2
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					}}
					transition={{ duration: 0.6 }}
					className={`text-2xl sm:text-3xl md:text-[38px] font-extrabold text-white mb-3 sm:mb-4 ${interTight.className}`}
				>
					What’s Hot Right Now
				</motion.h2>

				<motion.p
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					}}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-[#FFFFFF]/70 text-sm sm:text-md mt-2 sm:mt-3 max-w-[740px]"
				>
					Explore what’s trending! We feature 4 standout projects
					every week to spark your next build.
				</motion.p>
			</div>

			{/* Right: Button aligned to bottom of content (hidden on mobile) */}
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0 },
				}}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="hidden sm:flex items-end sm:ml-8"
			>
				<Link href="/projects">
					<button className="text-[13px] sm:text-[14px] border border-[#444] hover:border-white text-white px-3 sm:px-4 py-2 rounded-md transition cursor-pointer w-full sm:w-auto">
						More Projects
						<FontAwesomeIcon
							icon={faArrowRight}
							size="sm"
							className="ml-1.5 transform transition-transform duration-200"
						/>
					</button>
				</Link>
			</motion.div>
		</motion.div>
	);
}
