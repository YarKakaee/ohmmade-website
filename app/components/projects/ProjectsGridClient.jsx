'use client';

import ProjectCard from './ProjectCard';
import { motion } from 'framer-motion';

export default function ProjectsGridClient({ projects }) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={{
				visible: {
					transition: {
						staggerChildren: 0.15,
					},
				},
				hidden: {},
			}}
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
		>
			{projects.map((project) => (
				<motion.div
					key={project.id}
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					}}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<ProjectCard {...project} />
				</motion.div>
			))}
		</motion.div>
	);
}
