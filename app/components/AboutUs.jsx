'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRocket,
	faLightbulb,
	faUsers,
	faCode,
	faShieldAlt,
	faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';

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

const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutUs() {
	const features = [
		{
			icon: faRocket,
			title: 'Innovation at Speed',
			description:
				'We move fast and break things, but always with purpose. Our platform evolves daily to meet your needs.',
			color: '#FF6B6B',
		},
		{
			icon: faLightbulb,
			title: 'Brilliant Ideas',
			description:
				'Every project starts with a spark. We provide the tools to turn that spark into something extraordinary.',
			color: '#4ECDC4',
		},
		{
			icon: faUsers,
			title: 'Community First',
			description:
				'Built by makers, for makers. Our community drives innovation and supports growth at every level.',
			color: '#45B7D1',
		},
		{
			icon: faCode,
			title: 'Technical Excellence',
			description:
				'Clean, efficient, and powerful. Our platform is built with the latest technologies and best practices.',
			color: '#96CEB4',
		},
		{
			icon: faShieldAlt,
			title: 'Secure & Reliable',
			description:
				'Your work is safe with us. We implement enterprise-grade security to protect your projects.',
			color: '#FFEEAD',
		},
		{
			icon: faChartLine,
			title: 'Continuous Growth',
			description:
				"We're always improving. Regular updates and new features keep you ahead of the curve.",
			color: '#D4A5A5',
		},
	];

	return (
		<section className="relative py-24 px-4 md:px-12 bg-[#101014] overflow-hidden">
			{/* Background Elements */}
			{/* <div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#27BBFF]/5 to-transparent" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#27BBFF]/5 to-transparent" />
			</div> */}

			<div className="max-w-[1700px] mx-auto px-8 sm:px-16 relative z-10">
				{/* Title Section */}
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.h2
						className={`${interTight.className} text-4xl md:text-[46px] font-extrabold text-white mb-4`}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						Details That Define Us.
					</motion.h2>
					<motion.p
						className="text-gray-400 max-w-2xl mx-auto"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						viewport={{ once: true }}
					>
						Every part of OhmMade is crafted with purpose — from
						beginner-first tools to polished tutorials. Here’s what
						makes your experience feel different the moment you
						start building.
					</motion.p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{features.map((feature, i) => (
						<motion.div
							key={i}
							variants={cardVariants}
							className="group bg-[#13151A] border border-[#2C2F36] p-8 rounded-2xl relative overflow-hidden hover:shadow-lg transition-all duration-300"
							style={{ borderColor: feature.color }}
						>
							<div className="flex gap-4 items-start">
								<div
									className="p-3 rounded-lg transition-transform group-hover:scale-110"
									style={{
										backgroundColor: `${feature.color}20`,
									}}
								>
									<FontAwesomeIcon
										icon={feature.icon}
										className="text-2xl"
										style={{ color: feature.color }}
									/>
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-400 text-sm leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>

							{/* Hover Effects */}
							<div
								className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
								style={{
									background: `radial-gradient(circle at center, ${feature.color}10 0%, transparent 70%)`,
								}}
							/>
						</motion.div>
					))}
				</motion.div>

				{/* Stats Section */}
				<motion.div
					className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="text-center">
						<motion.h3
							className={`${interTight.className} text-4xl font-bold text-[#27BBFF] mb-2`}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							10K+
						</motion.h3>
						<p className="text-gray-400">Active Makers</p>
					</div>
					<div className="text-center">
						<motion.h3
							className={`${interTight.className} text-4xl font-bold text-[#27BBFF] mb-2`}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
						>
							500+
						</motion.h3>
						<p className="text-gray-400">Projects Created</p>
					</div>
					<div className="text-center">
						<motion.h3
							className={`${interTight.className} text-4xl font-bold text-[#27BBFF] mb-2`}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							viewport={{ once: true }}
						>
							24/7
						</motion.h3>
						<p className="text-gray-400">Support Available</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
