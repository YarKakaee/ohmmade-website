'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Inter_Tight } from 'next/font/google';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

// Animation Variants
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, staggerChildren: 0.2 },
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const videoVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.3 } },
};

const blurVariants = {
	hidden: { opacity: 0, scale: 1.1 },
	visible: {
		opacity: 0.6,
		scale: 1,
		transition: { duration: 1, delay: 0.4 },
	},
};

export default function Hero() {
	return (
		<section className="relative w-full min-h-[90vh] flex items-center justify-center px-8 sm:px-16 lg:px-24 mt-10">
			{/* Container to Match Nav Width */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="mx-auto max-w-[1700px] px-8 sm:px-16 flex items-center justify-between w-full"
			>
				{/* Left Side: Text Content */}
				<div className="text-white space-y-5 max-w-xl">
					<motion.p
						variants={fadeInUp}
						className="text-[15px] text-[#FFFFFF]/70 font-medium"
					>
						Learn What Matters. Build What's Possible.
					</motion.p>

					<motion.h1
						variants={fadeInUp}
						className={`text-4xl sm:text-[44px] font-[850] leading-tight ${interTight.className}`}
					>
						Turning One-Time Projects
					</motion.h1>

					<motion.h1
						variants={fadeInUp}
						className={`text-4xl sm:text-[54px] font-[900] leading-tight ${interTight.className} -mt-4`}
					>
						Into Lifelong Impact.
					</motion.h1>

					<motion.p
						variants={fadeInUp}
						className="text-[#FFFFFF]/65 max-w-lg font-normal text-[15px]"
					>
						A platform where ideas become hardware. Whether you're
						lighting LEDs or building medical tech, your knowledge
						can inspire someone. With OhmMade, you teach while you
						build.
					</motion.p>

					{/* CTA Buttons with Staggered Animation */}
					<motion.div
						variants={fadeInUp}
						className="flex space-x-4 mt-8"
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link
								href="/learn"
								className="bg-[#27BBFF] text-[#101014] px-5 py-3 rounded-md text-sm font-medium"
							>
								Start Learning
							</Link>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link
								href="/projects"
								className="bg-[#101014]/0 text-[#FFFFFF]/65 px-5 py-3 border-[#5C5C5E] border-1 rounded-md text-sm font-medium"
							>
								Explore Projects
							</Link>
						</motion.div>
					</motion.div>
				</div>

				{/* Right Side: Hero Video with Blurred Background */}
				<div className="hidden md:block relative w-[920px] h-[520px]">
					{/* Blurred Background Video */}
					<motion.div
						variants={blurVariants}
						initial="hidden"
						animate="visible"
						className="absolute inset-0 w-full h-full overflow-hidden rounded-lg blur-[60px] opacity-100 z-0"
					>
						<video
							autoPlay
							loop
							muted
							playsInline
							className="object-cover w-full h-full"
						>
							<source
								src="/assets/herovid.mp4"
								type="video/mp4"
							/>
						</video>
					</motion.div>

					{/* Main Foreground Video */}
					<motion.div
						variants={videoVariants}
						initial="hidden"
						animate="visible"
						className="absolute inset-0 w-full h-full z-10"
					>
						<video
							autoPlay
							loop
							muted
							playsInline
							className="rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] object-cover w-full h-full"
						>
							<source
								src="/assets/herovid.mp4"
								type="video/mp4"
							/>
						</video>
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
}
