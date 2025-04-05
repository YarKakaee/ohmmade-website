'use client'; // For Next.js App Router with client components

import {
	faGithub,
	faInstagram,
	faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TeamMemberCard({
	name,
	role,
	description,
	image,
	instagram,
	linkedin,
	github,
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			viewport={{ once: true }}
			className="flex flex-col sm:flex-row items-center sm:items-start space-y-8 sm:space-y-0 sm:space-x-22 w-full"
		>
			{/* Text Content - Name and Role on Top for Mobile */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="sm:hidden text-center text-white space-y-2"
			>
				<h3 className="text-2xl font-bold">{name}</h3>
				<p className="text-[#A1A1AA] text-base">{role}</p>
			</motion.div>

			{/* Profile Image with Blurred Background */}
			<motion.div
				transition={{ duration: 0.3, ease: 'easeOut' }}
				className="relative w-[360px] h-[360px] sm:w-[400px] sm:h-[400px]"
			>
				{/* Blurred Background Image */}
				<div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg blur-[70px] opacity-50 scale-105 z-0">
					<Image
						src={image}
						alt={`${name} Background`}
						width={500}
						height={500}
						className="object-cover w-full h-full"
					/>
				</div>

				{/* Main Foreground Image with Zoom */}
				<motion.div
					transition={{ duration: 0.3 }}
					className="relative w-full h-full z-10"
				>
					<Image
						src={image}
						alt={name}
						width={500}
						height={500}
						className="rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] object-cover w-full h-full"
					/>
				</motion.div>

				{/* Social Icons Below Image for Mobile */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="sm:hidden flex justify-center space-x-5 mt-4"
				>
					{instagram && (
						<motion.a
							whileHover={{
								scale: 1.2,
								rotate: 5,
								transition: { duration: 0.15, ease: 'easeOut' }, // Faster hover
							}}
							whileTap={{
								scale: 0.9,
								transition: { duration: 0.1 }, // Instant response
							}}
							href={instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#ACACAD] hover:text-white transition"
						>
							<FontAwesomeIcon icon={faInstagram} size="lg" />
						</motion.a>
					)}
					{linkedin && (
						<motion.a
							whileHover={{
								scale: 1.2,
								rotate: 5,
								transition: { duration: 0.15, ease: 'easeOut' }, // Faster hover
							}}
							whileTap={{
								scale: 0.9,
								transition: { duration: 0.1 }, // Instant response
							}}
							href={linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#ACACAD] hover:text-white transition"
						>
							<FontAwesomeIcon icon={faLinkedin} size="lg" />
						</motion.a>
					)}
					{github && (
						<motion.a
							whileHover={{
								scale: 1.2,
								rotate: 5,
								transition: { duration: 0.15, ease: 'easeOut' }, // Faster hover
							}}
							whileTap={{
								scale: 0.9,
								transition: { duration: 0.1 }, // Instant response
							}}
							href={github}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#ACACAD] hover:text-white transition"
						>
							<FontAwesomeIcon icon={faGithub} size="lg" />
						</motion.a>
					)}
				</motion.div>
			</motion.div>

			{/* Text Content and Social Icons for Larger Screens */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="hidden sm:flex flex-col justify-center text-white space-y-4 flex-1 self-center"
			>
				<div>
					<h3 className="text-2xl font-bold">{name}</h3>
					<p className="text-[#A1A1AA] text-base mt-1">{role}</p>
				</div>
				<p className="text-[#D1D5DB] text-sm leading-relaxed">
					{description}
				</p>

				{/* Social Icons for Desktop */}
				<div className="flex space-x-5 mt-1">
					{instagram && (
						<motion.a
							href={instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#ACACAD] hover:text-white transition"
						>
							<FontAwesomeIcon icon={faInstagram} size="lg" />
						</motion.a>
					)}
					{linkedin && (
						<motion.a
							href={linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#ACACAD] hover:text-white transition"
						>
							<FontAwesomeIcon icon={faLinkedin} size="lg" />
						</motion.a>
					)}
					{github && (
						<motion.a
							href={github}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#ACACAD] hover:text-white transition"
						>
							<FontAwesomeIcon icon={faGithub} size="lg" />
						</motion.a>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}
