import LayoutContainer from '@ohmmade/ui/layout-container';
import React from 'react';

export default function EducationComingSoon() {
	return (
		<div className="bg-[#101014] min-h-screen w-full">
			<section className="w-full pt-24 pb-32 text-white relative min-h-screen overflow-hidden">
				<LayoutContainer className="relative space-y-10">
					<div className="inline-block px-3 py-1 rounded-xl border border-[#333333] bg-[#1A1A1E] text-[#BBBBBB] text-sm font-medium mt-10">
						OUR VISION /
					</div>
					<h1 className="text-4xl font-extrabold mb-4">
						Empowering Classrooms. Inspiring Builders.
					</h1>
					<p className="text-lg text-white/80 mb-6">
						The future of engineering education isn't in dusty labs
						or lost PDFs. It's here - and we're building it.
					</p>
					<div className="border-t border-white/10 my-8" />
					<p className="mb-4 text-white/80">
						Every year, thousands of students across North America
						pour months into engineering projects. Circuits. Code.
						Creativity. But once it's over, the work disappears -
						boxed up, forgotten, or buried in a slideshow.
					</p>
					<p className="mb-4 text-white/80">
						We think that's broken.
					</p>

					<div className="border-t border-white/10 my-8" />
					<h2 className="text-xl font-semibold mb-3 text-white">
						What's Coming?
					</h2>
					<p className="mb-4 text-white/80">
						We're currently working with Western University to kick
						off our first official education partnership -
						westernu.ohmmade.ca
					</p>
					<p className="mb-4 text-white/80">
						Whether it's your ES1050 project, a term-specific
						prototype challenge, or even a single lab assignment,
						OhmMade will support:
					</p>
					<ul className="mb-4 text-white/80 list-disc pl-6">
						<li>Class-specific project hubs</li>
						<li>Instructor-led publishing</li>
						<li>Peer showcasing and feedback</li>
						<li>Public or private submission options</li>
					</ul>
					<div className="border-t border-white/10 my-8" />
					<h2 className="text-xl font-semibold mb-3 text-white">
						For Instructors
					</h2>
					<p className="mb-4 text-white/80">
						Want to showcase your class's work? We're making it easy
						for professors and TAs to host their course projects
						directly on OhmMade - with tools to organize, moderate,
						and highlight student submissions.
					</p>
					<p className="mb-4 text-white/80">
						Whether you teach 30 students or 300, this platform will
						scale with you.
					</p>
					<div className="border-t border-white/10 my-8" />
					<h2 className="text-xl font-semibold mb-3 text-white">
						We're Just Getting Started
					</h2>
					<p className="mb-4 text-white/80">
						The demand is real. The need is obvious. And we're
						already in motion.
					</p>
					<p className="mb-4 text-white/80">
						If you're an educator, student, or university
						decision-maker who wants to bring this to your school -
						reach out. Let's build the future of engineering
						education together.
					</p>
					<div className="border-t border-white/10 my-8" />
					<p className="mb-2 text-white/80">
						Contact us:{' '}
						<a
							href="mailto:help@ohmmade.ca"
							className="underline hover:text-[#27BBFF]"
						>
							help@ohmmade.ca
						</a>
					</p>
					<p className="mb-2 text-white/80">
						Education tools launching soon. Stay tuned.
					</p>
				</LayoutContainer>
			</section>
		</div>
	);
}
