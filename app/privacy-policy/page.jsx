'use client';

import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';
import Footer from '../components/Footer';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function PrivacyPolicy() {
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
						Privacy Policy
					</h1>

					<p className="text-[#BBBBBB]">
						Last updated: April 2, 2025
					</p>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							1. Information We Collect
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							We collect information you voluntarily provide when
							using OhmMade, such as your name, email, and project
							submissions. We may also collect basic usage data
							through analytics to improve performance and user
							experience.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							2. Use of Data
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Your data helps us provide services like user
							authentication, project publishing, comment
							functionality, and analytics. We do not sell or rent
							your personal data to third parties.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							3. Supabase & Third-Party Services
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							OhmMade uses Supabase for database, authentication,
							and file storage. Uploaded media (like project
							images) is stored in Supabase Buckets and may be
							publicly accessible. We also use analytics tools to
							understand site traffic and usage.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							We may use cookies or local storage for
							authentication, session persistence, and improving
							your experience. You can disable cookies through
							your browser settings, though it may impact
							functionality.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							5. Data Security
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							We take reasonable steps to secure your personal
							information using industry-standard practices.
							However, no method of transmission over the internet
							is 100% secure.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							6. Children’s Privacy
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							OhmMade does not knowingly collect data from
							children under 13. If you're a parent or guardian
							and believe your child has provided us with personal
							data, contact us for removal.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							7. Your Rights
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							You have the right to access, correct, or delete
							your data. You can also opt out of newsletters or
							analytics where applicable.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">
							8. Changes to this Policy
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							We may update this Privacy Policy as we grow.
							Changes will be posted on this page with the updated
							date. Continued use of OhmMade means you agree to
							the new policy.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-4">9. Contact</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							For any privacy-related questions, reach out to us
							at{' '}
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
