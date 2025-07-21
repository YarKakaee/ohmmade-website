'use client'; // For Next.js App Router with client components

import { motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';
import TeamMemberCard from '../common/TeamMemberCard';
import LayoutContainer from '@ohmmade/ui/layout-container';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

// Team data based on the Figma design
const teamMembers = [
	{
		name: 'Yar Kakaee',
		role: 'Founder, Head of Engineering',
		description:
			'Yar is a 2nd-year Software Engineering student at Western University with a strong background in web development, circuit design, microcontrollers, and full-stack software development. He’s passionate about building innovative projects that blend hardware and software — from hands-on electronics to scalable web applications. As the Founder and Head of Engineering at OhmMade, Yar leads all development and design efforts, having architected and engineered the platform from the ground up. He continues to shape OhmMade’s direction, ensuring an exceptional experience for makers and creators around the world.',
		image: '/assets/Yar.jpeg',
		instagram: 'https://www.instagram.com/yar.kakaee/',
		linkedin: 'https://www.linkedin.com/in/yar-kakaee/',
		github: 'https://github.com/YarKakaee',
	},
	{
		name: 'Tristan Biley',
		role: 'Co-Founder, Head of Finance & Strategy',
		description:
			'Tristan is a 2nd-year Electrical Engineering student, pursuing a dual degree with Ivey HBA at Western University. He has a profound passion for circuit design, microcontrollers, and embedded systems, continuously exploring the intersection of hardware and software. As Co-Founder and Head of Finance & Strategy, he leads the company’s financial planning, resource management, and long-term vision. Tristan plays a critical role in aligning OhmMade’s technical innovation with sustainable business development, helping guide the platform toward lasting impact and scalability.',
		image: '/assets/Tristan.png',
		instagram: 'https://www.instagram.com/tristan_biley_/',
		linkedin: 'https://www.linkedin.com/in/tristan-biley-81928526a/',
		github: 'https://github.com/TristanBiley',
	},
	{
		name: 'Serkan Nur',
		role: 'Co-Founder, Head of Hardware & Systems',
		description:
			'Serkan is a second-year Electrical Engineering student at Western University with a passion for building hardware systems and bringing ideas to life through hands-on engineering. At OhmMade, he leads all things hardware — from designing circuits to developing the systems behind our electronics-focused projects. As Co-Founder and Head of Hardware & Systems, Serkan plays a key role in making sure OhmMade bridges the gap between physical tech and maker creativity.',
		image: '/assets/Serkan.jpeg',
		instagram: 'https://www.instagram.com/_serkannur_/',
		linkedin: 'https://www.linkedin.com/in/serkan-nur-32710424a/',
		github: 'https://github.com/serkannur',
	},
	{
		name: 'Andres Holmes',
		role: 'Head of Marketing & Outreach',
		description:
			'Andres is a 2nd-year student studying DAN Management and Organizational Studies with a specialization in Finance at Western University. He brings a creative and strategic mindset to OhmMade, focusing on marketing, branding, and outreach. With a passion for connecting people and ideas, Andres helps shape the way OhmMade engages with the community, ensuring our mission reaches learners and makers everywhere.',
		image: '/assets/Andres.jpeg',
		instagram: 'https://www.instagram.com/ig.andres/',
		linkedin: 'https://www.linkedin.com/in/andresholmes/',
	},
];

export default function OurTeam() {
	return (
		<section className="relative w-full py-20">
			<LayoutContainer>
				<div className="mx-auto max-w-[1700px]">
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
			</LayoutContainer>
		</section>
	);
}
