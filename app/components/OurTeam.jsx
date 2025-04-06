'use client'; // For Next.js App Router with client components

import { motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';
import TeamMemberCard from './TeamMemberCard';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

// Team data based on the Figma design
const teamMembers = [
	{
		name: 'Yar Kakaee',
		role: 'Co-Founder and Lead Software Engineer',
		description:
			'Yar is a soon-to-be 2nd-year student pursuing Mechatronic Systems Engineering and Artificial Intelligence Systems Engineering (AISE) at Western University. With a strong background in web development, Raspberry Pi, and Arduino, Yar has a deep passion for building innovative microcontroller projects and web applications. His expertise lies in combining hardware and software to create interactive and impactful solutions. At OhmMade, Yar leads the development and design efforts, ensuring the platform delivers an exceptional experience to all users.',
		image: '/assets/Yar.jpeg',
		instagram: 'https://www.instagram.com/yar.kakaee/',
		linkedin: 'https://www.linkedin.com/in/yar-kakaee/',
		github: 'https://github.com/YarKakaee',
	},
	{
		name: 'Tristan Biley',
		role: 'Co-Founder and Lead Electrical Engineer',
		description:
			'Tristan is a soon-to-be 2nd-year Electrical Engineering student, pursuing a dual degree with Ivey HBA at Western University. He has a profound passion for circuit design, microcontrollers, and embedded systems, continuously exploring the intersection of hardware and software. His expertise in circuitry and systems integration helps power OhmMade’s mission to create hands-on learning experiences for makers. As the Lead Electrical Engineer, Tristan drives innovative project ideas and ensures seamless integration of hardware and software, contributing significantly to OhmMade’s growth.',
		image: '/assets/Tristan.png',
		instagram: 'https://www.instagram.com/tristan_biley_/',
		linkedin: 'https://www.linkedin.com/in/tristan-biley-81928526a/',
	},
	{
		name: 'Serkan Nur',
		role: 'Co-Founder and Chief Creative Officer',
		description:
			'Serkan is a soon-to-be 2nd-year Electrical and Biomedical Engineering student at Western University. He has a strong passion for coding and game development, with a keen interest in creating interactive learning experiences that combine creativity with technical excellence. Serkan’s contributions to OhmMade focus on designing intuitive interfaces and crafting educational content that empowers users to explore technology confidently.',
		image: '/assets/Serkan.jpeg',
		instagram: 'https://www.instagram.com/_serkannur_/',
		linkedin: 'https://www.linkedin.com/in/serkan-nur-32710424a/',
	},
	{
		name: 'Andres Holmes',
		role: 'Marketing Director',
		description:
			'Andres is a soon-to-be 2nd-year student studying DAN Management and Organizational Studies with a specialization in Finance at Western University. He brings a creative and strategic mindset to OhmMade, focusing on marketing, branding, and outreach. With a passion for connecting people and ideas, Andres helps shape the way OhmMade engages with the community, ensuring our mission reaches learners and makers everywhere.',
		image: '/assets/Andres.jpeg',
		instagram: 'https://www.instagram.com/ig.andres/',
		linkedin: 'https://www.linkedin.com/in/andresholmes/',
	},
];

export default function OurTeam() {
	return (
		<section className="relative w-full py-20 px-8 sm:px-16 lg:px-24">
			<div className="mx-auto max-w-[1700px] px-8 sm:px-16">
				<motion.h2
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: 'easeOut' }}
					viewport={{ once: true }}
					className={`text-white text-4xl font-extrabold mb-16 ${interTight.className} text-center md:text-start`}
				>
					Meet Our Team
				</motion.h2>

				{/* Team Members Grid with staggered animations */}
				<div className="grid grid-cols-1 gap-20">
					{teamMembers.map((member, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.5,
								delay: index * 0.2,
								ease: 'easeOut',
							}}
							viewport={{ once: true }}
						>
							<TeamMemberCard {...member} />
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
