'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faGithub,
	faLinkedin,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';

// Team data
const team = [
	{
		name: 'Yar',
		title: 'Founder & Head of Engineering',
		bio: '2nd year Software Engineering student at Western who lives for building cool stuff — both hardware and software. Built OhmMade from the ground up and leads all design and dev.',
		img: '/assets/Yar.jpeg',
		socials: {
			github: 'https://github.com/YarUsername',
			linkedin: 'https://linkedin.com/in/YarUsername',
			instagram: 'https://instagram.com/YarUsername',
		},
	},
	{
		name: 'Tristan',
		title: 'Co-Founder & Head of Finance & Strategy',
		bio: "Electrical engineering and business at Western + Ivey. He's the strategy brain and money guy, making sure OhmMade scales smart and stays sharp.",
		img: '/assets/Tristan.png',
		socials: {
			linkedin: 'https://linkedin.com/in/TristanUsername',
		},
	},
	{
		name: 'Serkan',
		title: 'Co-Founder & Head of Hardware & Systems',
		bio: "Loves turning ideas into working tech. He handles the hardware side — from circuit design to system builds. If it lights up, moves, or runs on volts, he's probably behind it.",
		img: '/assets/Serkan.jpeg',
		socials: {
			github: 'https://github.com/SerkanUsername',
			linkedin: 'https://linkedin.com/in/SerkanUsername',
		},
	},
	{
		name: 'Andres',
		title: 'Head of Marketing & Outreach',
		bio: "Studies finance but thinks like a brand builder. He's the reason more people hear about OhmMade — shaping how we show up, look, and connect.",
		img: '/assets/Andres.jpeg',
		socials: {
			instagram: 'https://instagram.com/AndresUsername',
			linkedin: 'https://linkedin.com/in/AndresUsername',
		},
	},
];

// Animated heading component
const AnimatedHeading = ({ children, className = '' }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });

	return (
		<motion.h2
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 30 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
		>
			{children}
		</motion.h2>
	);
};

// Animated text component
const AnimatedText = ({ children, className = '', delay = 0.2 }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-50px' });

	return (
		<motion.p
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 20 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.6, delay, ease: 'easeOut' }}
		>
			{children}
		</motion.p>
	);
};

// Particles background component
const ParticlesBackground = () => {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{Array.from({ length: 20 }).map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-1 h-1 bg-white/10 rounded-full"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
					}}
					animate={{
						y: [0, -100, 0],
						opacity: [0, 0.5, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: 4 + Math.random() * 2,
						repeat: Infinity,
						delay: Math.random() * 2,
					}}
				/>
			))}
		</div>
	);
};

// Section wrapper component
const Section = ({
	children,
	className = '',
	bgGradient = 'from-blue-900/20 to-purple-900/20',
}) => {
	return (
		<section
			className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className}`}
		>
			{/* Background gradient */}
			<div
				className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}
			/>

			{/* Particles */}
			<ParticlesBackground />

			{/* Content */}
			<div className="relative z-10 w-full max-w-6xl mx-auto px-6">
				{children}
			</div>
		</section>
	);
};

// Team member card component
const TeamCard = ({ member }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-50px' });

	return (
		<motion.div
			ref={ref}
			className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
			initial={{ opacity: 0, y: 30 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			whileHover={{ y: -5, scale: 1.02 }}
		>
			<div className="flex flex-col items-center text-center">
				{/* Image */}
				<div className="relative w-24 h-24 mb-4">
					<Image
						src={member.img}
						alt={member.name}
						fill
						className="object-cover rounded-full"
					/>
				</div>

				{/* Info */}
				<h3 className="text-xl font-bold text-white mb-1">
					{member.name}
				</h3>
				<p className="text-sm text-blue-300 mb-3">{member.title}</p>
				<p className="text-sm text-white/80 mb-4 leading-relaxed">
					{member.bio}
				</p>

				{/* Social links */}
				<div className="flex gap-3">
					{Object.entries(member.socials).map(([key, url]) => {
						const iconMap = {
							github: faGithub,
							linkedin: faLinkedin,
							instagram: faInstagram,
						};
						const icon = iconMap[key];
						return (
							<motion.a
								key={key}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-blue-400 transition-colors"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<FontAwesomeIcon
									icon={icon}
									className="text-sm"
								/>
							</motion.a>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
};

export default function AboutPage() {
	return (
		<div className="bg-black text-white">
			{/* The Problem */}
			<Section bgGradient="from-red-900/20 to-orange-900/20">
				<div className="text-center max-w-4xl mx-auto">
					<AnimatedHeading className="text-3xl md:text-4xl font-bold text-white mb-6">
						We were tired of school projects going nowhere.
					</AnimatedHeading>
					<AnimatedText className="text-lg md:text-xl text-white/80 leading-relaxed">
						Every year, thousands of students spend months building
						something real. Circuits. Sensors. Code. Guts. Grit. All
						of it.
					</AnimatedText>
				</div>
			</Section>

			{/* The Cycle */}
			<Section bgGradient="from-yellow-900/20 to-orange-900/20">
				<div className="text-center max-w-4xl mx-auto">
					<AnimatedHeading className="text-3xl md:text-4xl font-bold text-white mb-6">
						Build → Present → Vanish
					</AnimatedHeading>
					<AnimatedText className="text-lg md:text-xl text-white/80 leading-relaxed mb-4">
						They stay up late, debug, redesign, test again. They
						present it. Maybe post it. Then it disappears.
					</AnimatedText>
					<AnimatedText
						className="text-lg md:text-xl text-white/80 leading-relaxed"
						delay={0.4}
					>
						The prototype gets boxed. The files get lost. And the
						work? Forgotten.
					</AnimatedText>
				</div>
			</Section>

			{/* Breaking That Cycle */}
			<Section bgGradient="from-green-900/20 to-blue-900/20">
				<div className="text-center max-w-4xl mx-auto">
					<AnimatedHeading className="text-3xl md:text-4xl font-bold text-white mb-6">
						We made OhmMade to break that cycle.
					</AnimatedHeading>
					<AnimatedText className="text-lg md:text-xl text-white/80 leading-relaxed">
						That's how it's always been. Build → Present → Vanish.
						Next year, the cycle starts over.
					</AnimatedText>
				</div>
			</Section>

			{/* The Manifesto */}
			<Section bgGradient="from-blue-900/20 to-purple-900/20">
				<div className="text-center max-w-5xl mx-auto">
					<AnimatedHeading className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
						Because student projects deserve more than a slide deck.
					</AnimatedHeading>
					<div className="grid md:grid-cols-2 gap-8 text-left">
						<AnimatedText
							className="text-lg text-white/90 leading-relaxed"
							delay={0.3}
						>
							This platform is for the builders — the ones who
							spent 4 months wiring a solution that no one else
							saw. It's for that first-year team who built a laser
							tripwire and had nowhere to actually share how it
							worked.
						</AnimatedText>
						<AnimatedText
							className="text-lg text-white/90 leading-relaxed"
							delay={0.5}
						>
							It's for the engineering labs, the class
							competitions, the ideas that only exist on a PDF
							now. We're here to give those projects a proper
							home. To let students publish, showcase, and inspire
							— not just present and forget.
						</AnimatedText>
					</div>
				</div>
			</Section>

			{/* Meet the Team */}
			<Section bgGradient="from-purple-900/20 to-pink-900/20">
				<div className="text-center">
					<AnimatedHeading className="text-3xl md:text-4xl font-bold text-white mb-12">
						Meet the Team
					</AnimatedHeading>
					<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
						{team.map((member, index) => (
							<TeamCard key={member.name} member={member} />
						))}
					</div>
				</div>
			</Section>

			{/* CTA */}
			<Section bgGradient="from-blue-900/20 to-cyan-900/20">
				<div className="text-center max-w-4xl mx-auto">
					<AnimatedHeading className="text-3xl md:text-4xl font-bold text-white mb-6">
						Welcome to OhmMade
					</AnimatedHeading>
					<AnimatedText className="text-lg md:text-xl text-white/80 mb-8">
						Where student projects finally live on.
					</AnimatedText>
					<motion.button
						className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Start Building
					</motion.button>
				</div>
			</Section>
		</div>
	);
}
