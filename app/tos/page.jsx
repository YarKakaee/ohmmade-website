'use client';

import { Inter_Tight } from 'next/font/google';

const interTight = Inter_Tight({ subsets: ['latin'] });

import Image from 'next/image';
import Footer from '../components/Footer';

export default function TermsOfService() {
	return (
		<div className="bg-[#101014]">
			<section className="w-full pt-26 pb-34 px-8 sm:px-16 lg:px-24 text-white relative min-h-screen bg-[#101014] overflow-hidden">
				{/* Blurred background effect */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
						<Image
							src="https://cms-assets.unrealengine.com/AiKUh5PQCTaOFnmJDZJBfz/oXIAOr5gQny2cAfPpq02"
							alt="Abstract light pattern"
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
						Terms of Service
					</h1>

					<p className="text-[#BBBBBB]">
						Last updated: April 2, 2025
					</p>

					<section>
						<h2 className="text-2xl font-bold mb-4">1. Overview</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							OhmMade is a platform dedicated to simplifying
							electronics education by offering tutorials,
							interactive projects, and community-driven resources
							for hardware like Raspberry Pi, Arduino, and
							microcontrollers. By using OhmMade, you agree to
							comply with and be bound by these Terms of Service.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							2. User Submissions & Projects
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Users may submit electronics projects, tutorials,
							code, images, and written content. By submitting,
							you grant OhmMade a non-exclusive, royalty-free
							license to display, promote, and share your content
							within the platform. You retain ownership but are
							responsible for the originality and legality of your
							submissions.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							3. Use of Supabase Buckets
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							OhmMade uses Supabase storage buckets for handling
							user-uploaded images associated with projects. These
							files are publicly accessible and must not contain
							explicit, harmful, or copyrighted material unless
							you own the rights.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							4. Account Responsibility
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							While many features are publicly available, certain
							submission and community features may require you to
							create an account. You are responsible for
							maintaining the security of your credentials and any
							activity under your account.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							5. Intellectual Property
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							All site branding, visuals, UI design, and original
							content created by OhmMade are the intellectual
							property of OhmMade and may not be reproduced or
							redistributed without written permission.
							User-submitted content remains the property of its
							respective creators.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							6. Limitations
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							OhmMade is not responsible for any damages or loss
							arising from the use or misuse of hardware,
							software, or project tutorials featured on the
							platform. All content is provided “as is” for
							educational purposes.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							7. Changes to the Terms
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							We reserve the right to modify these Terms of
							Service at any time. Users will be notified of major
							changes and continued use of the site after changes
							constitutes acceptance of the updated terms.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">8. Contact</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							If you have any questions about these Terms, feel
							free to reach out to us at{' '}
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
