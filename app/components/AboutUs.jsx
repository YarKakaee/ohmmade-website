'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRocket,
	faLightbulb,
	faUsers,
	faCode,
	faShieldAlt,
	faChartLine,
	faCompass,
	faBookOpen,
	faShareNodes,
	faFireFlameCurved,
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
			icon: faLightbulb,
			title: 'Brilliant Ideas',
			description:
				'Tutorials aren’t just steps — they’re stories. We give you the tools to turn your ideas into polished, publishable walkthroughs with live code, media, and structure.',
			color: '#27BBFF',
		},

		{
			icon: faCompass,
			title: 'Discover Real Projects',
			description:
				'Explore hands-on projects made by makers around the world — from Arduino to Raspberry Pi. Filter by device, difficulty, and tags.',
			color: '#27BBFF',
		},
		{
			icon: faBookOpen,
			title: 'Learn by Building',
			description:
				'Dive into beginner-friendly guides that teach electronics and microcontrollers the way they’re meant to be learned — hands-on.',
			color: '#27BBFF',
		},
		{
			icon: faUsers,
			title: 'Community First',
			description:
				'OhmMade is built by makers, for makers. Our platform highlights your work, fuels collaboration, and puts creator credit front and center.',
			color: '#27BBFF',
		},
		{
			icon: faRocket,
			title: 'Share your Creations',
			description:
				'Turn your project into a polished tutorial. With rich blocks, code snippets, and images, publishing is as easy as building.',
			color: '#27BBFF',
		},
		{
			icon: faChartLine,
			title: 'Built for Growth',
			description:
				'From your first LED to your tenth prototype, OhmMade grows with you. Learn, share, and level up at your own pace.',
			color: '#27BBFF',
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
						At OhmMade, every detail is intentional — from how you
						share your work to how others learn from it. These
						aren’t just platform features. They’re pillars of how we
						empower makers.
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
				{/* <motion.div
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
							75+
						</motion.h3>
						<p className="text-gray-400">Projects In Progress</p>
					</div>
					<div className="text-center">
						<motion.h3
							className={`${interTight.className} text-4xl font-bold text-[#27BBFF] mb-2`}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
						>
							24/7
						</motion.h3>
						<p className="text-gray-400">Support Available</p>
					</div>
					<div className="text-center">
						<motion.h3
							className={`${interTight.className} text-4xl font-bold text-[#27BBFF] mb-2`}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							viewport={{ once: true }}
						>
							∞
						</motion.h3>
						<p className="text-gray-400">Possibilities</p>
					</div>
				</motion.div> */}
			</div>
		</section>
	);
}
