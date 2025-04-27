// components/CreatorSection.jsx

'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRocket,
	faUsers,
	faChartLine,
	faCode,
	faLightbulb,
	faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

const interTight = Inter_Tight({ subsets: ['latin'] });

const benefits = [
	{
		icon: faRocket,
		title: 'Launch Your Ideas',
		description:
			'Transform your electronics projects into shareable content and inspire others in the community.',
		color: '#27BBFF',
	},
	{
		icon: faUsers,
		title: 'Build Your Audience',
		description:
			'Connect with makers worldwide, get feedback, and grow your following.',
		color: '#FF6B6B',
	},
	{
		icon: faChartLine,
		title: 'Track Your Impact',
		description:
			'See how many people your projects help through views, likes, and comments.',
		color: '#4ECDC4',
	},
	{
		icon: faCode,
		title: 'Share Your Knowledge',
		description:
			'Document your learning journey and help others avoid common pitfalls.',
		color: '#FFD166',
	},
	{
		icon: faLightbulb,
		title: 'Get Inspired',
		description:
			'Discover new ideas and techniques from other creators in the community.',
		color: '#A78BFA',
	},
	{
		icon: faHeart,
		title: 'Make a Difference',
		description:
			'Help beginners get started and contribute to the maker community.',
		color: '#FF6B6B',
	},
];

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
		},
	},
};

export default function CreatorSection() {
	return (
		<section className="relative w-full py-32 px-8 sm:px-16 lg:px-24 overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-[#101014] via-[#1A1A1E] to-[#101014] z-0" />

			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden z-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#27BBFF]/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl" />
			</div>

			<div className="max-w-[1700px] mx-auto px-8 sm:px-16 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left Column - Content */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="space-y-8"
					>
						<div>
							<h2
								className={`text-[40px] font-black mb-4 text-white leading-tight ${interTight.className}`}
							>
								Your Work Deserves to Be Seen.
							</h2>
							<p className="text-white/60 text-lg">
								Share your projects, inspire others, and grow as
								a maker. Join our community of creators and make
								an impact.
							</p>
						</div>

						<motion.div
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="grid grid-cols-1 sm:grid-cols-2 gap-6"
						>
							{benefits.slice(0, 4).map((benefit, index) => (
								<motion.div
									key={index}
									variants={itemVariants}
									className="bg-[#1E2025]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
								>
									<div
										className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
										style={{
											backgroundColor: `${benefit.color}20`,
										}}
									>
										<FontAwesomeIcon
											icon={benefit.icon}
											className="text-xl"
											style={{ color: benefit.color }}
										/>
									</div>
									<h3 className="text-lg font-bold text-white mb-2">
										{benefit.title}
									</h3>
									<p className="text-white/60 text-sm">
										{benefit.description}
									</p>
								</motion.div>
							))}
						</motion.div>

						<motion.div>
							<Link
								href="/projects/publish"
								className="inline-flex items-center gap-2 bg-[#27BBFF] text-[#101014] px-5 py-3 rounded-md font-medium hover:brightness-110 transition-all duration-300"
							>
								<FontAwesomeIcon
									icon={faRocket}
									className="text-sm"
								/>
								Start Creating
							</Link>
						</motion.div>
					</motion.div>

					{/* Right Column - Visual */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="relative"
					>
						<div className="relative aspect-square max-w-2xl mx-auto">
							{/* Main card */}
							<motion.div
								initial={{ scale: 0.95 }}
								whileInView={{ scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="absolute inset-0 bg-[#1E2025]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
							>
								<div className="space-y-6">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-xl bg-[#27BBFF]/20 flex items-center justify-center">
											<FontAwesomeIcon
												icon={faRocket}
												className="text-xl text-[#27BBFF]"
											/>
										</div>
										<div>
											<h3 className="text-xl font-bold text-white">
												Your Project
											</h3>
											<p className="text-white/60">
												Ready to share with the world
											</p>
										</div>
									</div>
									<div className="h-48 bg-[#2C2F36]/50 rounded-xl" />
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full bg-[#2C2F36]" />
											<span className="text-white/60">
												Your Name
											</span>
										</div>
										<div className="flex items-center gap-4 text-white/60">
											<span className="flex items-center gap-1">
												<FontAwesomeIcon
													icon={faHeart}
													className="text-[#FF6B6B]"
												/>
												0
											</span>
											<span className="flex items-center gap-1">
												<FontAwesomeIcon
													icon={faChartLine}
													className="text-[#4ECDC4]"
												/>
												0
											</span>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Floating cards */}
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.4 }}
								className="absolute -top-8 -right-8 w-64 h-40 bg-[#1E2025]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 rounded-full bg-[#2C2F36]" />
									<div>
										<h4 className="text-sm font-bold text-white">
											New Comment
										</h4>
										<p className="text-xs text-white/60">
											Great project!
										</p>
									</div>
								</div>
								<div className="h-16 bg-[#2C2F36]/50 rounded-lg" />
							</motion.div>

							<motion.div
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.6 }}
								className="absolute -bottom-8 -left-8 w-64 h-40 bg-[#1E2025]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 rounded-full bg-[#2C2F36]" />
									<div>
										<h4 className="text-sm font-bold text-white">
											Project Stats
										</h4>
										<p className="text-xs text-white/60">
											Growing fast!
										</p>
									</div>
								</div>
								<div className="h-16 bg-[#2C2F36]/50 rounded-lg" />
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
