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
			className="flex justify-between mb-12"
		>
			{/* Left: Title + Description */}
			<div className="flex-1">
				<motion.h2
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					}}
					transition={{ duration: 0.6 }}
					className={`text-[40px] font-extrabold text-white leading-tight ${interTight.className}`}
				>
					See What’s Possible. <br />
					<span>Share What You Build.</span>
				</motion.h2>

				<motion.p
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					}}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-[#FFFFFF]/70 text-md mt-3 max-w-[740px]"
				>
					Browse through a variety of hands-on projects created by
					OhmMade or published by fellow makers. From Raspberry Pi and
					Arduino builds to innovative microcontroller applications,
					explore and contribute to a growing library of inspiring
					projects.
				</motion.p>
			</div>

			{/* Right: Button aligned to bottom of content */}
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0 },
				}}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex items-end ml-8"
			>
				<Link href="/projects">
					<button className="border border-[#444] hover:border-white text-white px-4 py-2 rounded-md transition cursor-pointer">
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
