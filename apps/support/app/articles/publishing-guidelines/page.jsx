'use client';

import { Inter_Tight } from 'next/font/google';
import LayoutContainer from '@ohmmade/ui/layout-container';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function PublishingGuidelinesPage() {
	return (
		<div className="bg-[#101014]">
			<section className="w-full pt-26 pb-34 text-white relative min-h-screen overflow-hidden">
				<LayoutContainer className="relative space-y-10">
					<div className="inline-block px-3 py-1 rounded-xl border border-[#333333] bg-[#1A1A1E] text-[#BBBBBB] text-sm font-medium mt-10">
						HELP /
					</div>
					<h1
						className={`text-5xl font-extrabold ${interTight.className}`}
					>
						Publishing Guidelines
					</h1>

					<p className="text-[#BBBBBB]">
						Last updated: July 21, 2025
					</p>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							1. Before You Publish
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							OhmMade is a beginner-friendly, project-based
							learning platform. When publishing your content,
							keep these tips in mind to make it useful, easy to
							follow, and inspiring for others.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							2. Core Guidelines
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Be clear and beginner-friendly - explain each
								step simply.
							</li>
							<li>
								Use the <strong>section blocks</strong> to break
								content into chunks: headings, images, code, and
								notes.
							</li>
							<li>
								Add code using the <strong>"Code"</strong> block
								with title, language, and optional description.
							</li>
							<li>
								Include pictures, wiring diagrams, and real
								build images wherever possible.
							</li>
							<li>
								Give your project a short and descriptive title
								(max 32 characters).
							</li>
							<li>
								Keep your project card description concise (max
								195 characters).
							</li>
							<li>
								Don't include personal info like full name,
								email, location, or credentials in your writeup.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							3. Formatting Tips
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Use bullet points or step-by-step numbers for
								clarity.
							</li>
							<li>
								Add tags like "LED", "sensor", or "automation"
								to help users discover your work.
							</li>
							<li>
								Use headings (H1, H2, H3) to break your tutorial
								into sections.
							</li>
							<li>
								Preview your project before publishing to make
								sure everything looks clean.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							4. Content Quality
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Make sure your project actually works and you've
								tested it.
							</li>
							<li>
								Include a clear list of materials and components
								needed.
							</li>
							<li>
								Explain the "why" behind your choices, not just
								the "how".
							</li>
							<li>
								Share any troubleshooting tips or common issues
								you encountered.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							5. Images &amp; Media
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Use high-quality, well-lit photos of your
								project.
							</li>
							<li>
								Include close-ups of important details and
								connections.
							</li>
							<li>
								Show both the finished project and key steps
								along the way.
							</li>
							<li>
								Add wiring diagrams or schematics when helpful.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							6. Code Examples
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Use the Code block feature with proper language
								tags.
							</li>
							<li>
								Add comments to explain what each section does.
							</li>
							<li>
								Include the complete, working code that readers
								can copy.
							</li>
							<li>
								Mention any libraries or dependencies needed.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							7. Community Standards
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Be respectful and inclusive in your language and
								examples.
							</li>
							<li>
								Don't plagiarize - credit original sources and
								inspiration.
							</li>
							<li>
								Avoid promoting commercial products or services
								excessively.
							</li>
							<li>
								Keep content appropriate for all ages and skill
								levels.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							8. After Publishing
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Respond to comments and questions from the
								community.
							</li>
							<li>
								Update your project if you make improvements or
								find errors.
							</li>
							<li>
								Share your project on social media to help
								others discover it.
							</li>
							<li>
								Engage with other makers' projects to build the
								community.
							</li>
						</ul>
					</section>
					<section>
						<h2 className="text-2xl font-bold mb-3">
							9. Need Help?
						</h2>
						<p className="text-[#CCCCCC]">
							If you're unsure about formatting or need feedback,
							feel free to reach out at{' '}
							<a
								href="mailto:help@ohmmade.ca"
								className="text-[#27BBFF] underline"
							>
								help@ohmmade.ca
							</a>
							.
						</p>
					</section>
				</LayoutContainer>
			</section>
		</div>
	);
}
