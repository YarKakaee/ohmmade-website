'use client';

import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';
import Footer from '../components/Footer';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function PublishingGuidelinesPage() {
	return (
		<div className="bg-[#101014]">
			<section className="w-full pt-26 pb-34 px-8 sm:px-16 lg:px-24 text-white relative min-h-screen overflow-hidden">
				{/* Blurred background */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
						<Image
							src="https://cms-assets.unrealengine.com/AiKUh5PQCTaOFnmJDZJBfz/oXIAOr5gQny2cAfPpq02"
							alt="Blurred background"
							width={1200}
							height={1200}
							className="w-full h-auto"
							priority
						/>
					</div>
				</div>

				<div className="relative max-w-[1200px] mx-auto space-y-10">
					<h1
						className={`text-5xl font-extrabold mt-20 ${interTight.className}`}
					>
						Publishing Guidelines
					</h1>

					<p className="text-[#BBBBBB]">
						Last updated: April 4, 2025
					</p>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							Before You Publish
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
							Core Guidelines
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Be clear and beginner-friendly – explain each
								step simply.
							</li>
							<li>
								Use the <strong>section blocks</strong> to break
								content into chunks: headings, images, code, and
								notes.
							</li>
							<li>
								Add code using the <strong>“Code”</strong> block
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
								Don’t include personal info like full name,
								email, location, or credentials in your writeup.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							Formatting Tips
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
							What Not to Include
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Plagiarized or uncredited code/content from
								others.
							</li>
							<li>
								Adult content, hate speech, or offensive
								language.
							</li>
							<li>Sensitive personal data.</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">Need Help?</h2>
						<p className="text-[#CCCCCC]">
							If you're unsure about formatting or need feedback,
							feel free to reach out at{' '}
							<a
								href="mailto:support@ohmmade.ca"
								className="text-[#27BBFF] underline"
							>
								support@ohmmade.ca
							</a>
							.
						</p>
					</section>
				</div>
			</section>

			<Footer />
		</div>
	);
}
