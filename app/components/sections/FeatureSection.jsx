'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faGraduationCap,
	faPuzzlePiece,
	faWrench,
} from '@fortawesome/free-solid-svg-icons';

import { Inter_Tight } from 'next/font/google';
import { motion } from 'framer-motion';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 30, scale: 0.95 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.6, ease: 'easeOut' },
	},
};

export default function FeatureSection() {
	const features = [
		{
			icon: faGraduationCap,
			title: 'For Beginners, Built by Builders',
			description:
				'Zero to solder in no time. No clutter, no gatekeeping. OhmMade guides you every step of the way — clean, clear, and beginner-first.',
		},
		{
			icon: faPuzzlePiece,
			title: 'Stunning Project Pages',
			description:
				'Not just steps — immersive, editable tutorials with rich blocks, embedded code, and polished formatting built with creators in mind.',
		},
		{
			icon: faWrench,
			title: 'Publish and Improve',
			description:
				'Update your projects. Get feedback. Inspire and grow with the community — OhmMade is a living ecosystem for makers.',
		},
	];

	return (
		<section className="text-white py-24 px-4 md:px-12 border-[#1b1d23] relative overflow-hidden mb-24">
			<div className="max-w-[1700px] mx-auto px-8 sm:px-16">
				{/* Title */}
				<motion.div className="mb-16">
					<motion.h2
						className={`${interTight.className} text-4xl md:text-[46px] font-extrabold`}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: 'easeOut',
							delay: 0,
						}}
						viewport={{ once: true }}
					>
						Details That Define Us.
					</motion.h2>

					<motion.p
						className="text-gray-400 mt-4 max-w-xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: 'easeOut',
							delay: 0.2,
						}}
						viewport={{ once: true }}
					>
						Every part of OhmMade is crafted with purpose — from
						beginner-first tools to polished tutorials. Here’s what
						makes your experience feel different the moment you
						start building.
					</motion.p>
				</motion.div>

				{/* Features */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{features.map((feature, i) => (
						<motion.div
							key={i}
							variants={cardVariants}
							className="group bg-[#13151A] border border-[#2C2F36] p-12 rounded-2xl relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#27BBFF]"
						>
							<div className="flex gap-3 items-start">
								<FontAwesomeIcon
									icon={feature.icon}
									className="text-[#27BBFF] text-2xl group-hover:scale-110 transition-transform"
								/>
								<h3 className="text-xl font-semibold mb-3">
									{feature.title}
								</h3>
							</div>
							<p className="text-gray-400 text-sm leading-relaxed -mb-2">
								{feature.description}
							</p>

							{/* Subtle neon edge glow on hover */}
							<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 border border-[#27BBFF] rounded-2xl blur-sm" />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
