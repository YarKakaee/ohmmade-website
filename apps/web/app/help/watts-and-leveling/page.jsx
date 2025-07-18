'use client';

import LayoutContainer from '@ohmmade/ui/layout-container';
import { Inter_Tight } from 'next/font/google';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function WattsGuidePage() {
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
						Watts & Leveling
					</h1>
					<p className="text-[#BBBBBB]">Last updated: July 6, 2025</p>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							1. What Are Watts?
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Watts are OhmMade's way of measuring your activity
							and impact across the community. Every action you
							take — publishing a project, receiving likes,
							commenting, or helping others — earns you Watts.
							Think of it as your creative energy level ⚡.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							2. How Do You Earn Watts?
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Publishing a new project — big boost of Watts.
							</li>
							<li>Receiving likes on your projects.</li>
							<li>Gaining new followers.</li>
							<li>
								Commenting on and supporting other projects.
							</li>
							<li>
								Getting featured on the homepage or trending
								list.
							</li>
							<li>Completing community challenges or events.</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							3. Leveling Up
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							As you accumulate Watts, you'll automatically climb
							through levels — from Newbie to Grandmaster and
							beyond. Each level reflects your activity and
							contribution to the OhmMade community.
						</p>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2 mt-3">
							<li>
								Level names might include: Newbie, Explorer,
								Creator, Innovator, Master, Grandmaster.
							</li>
							<li>
								Each level unlocks new badges, profile
								highlights, and occasionally exclusive features
								or perks.
							</li>
							<li>
								Your level is displayed on your profile and can
								help others trust your expertise.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							4. Badges & Achievements
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Alongside levels, you can earn unique badges for
							specific accomplishments — like being an Early
							Contributor, having a Top Project, or helping many
							other makers. These badges appear on your profile
							and show your unique journey.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							5. Why Level Up?
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Showcase your dedication and expertise to the
								community.
							</li>
							<li>Get featured more often as a trusted maker.</li>
							<li>Access exclusive rewards and opportunities.</li>
							<li>
								Motivate yourself to keep learning, building,
								and sharing.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							6. Need Help?
						</h2>
						<p className="text-[#CCCCCC]">
							If you have questions about Watts, leveling, or
							badges, reach out to us at{' '}
							<a
								href="mailto:support@ohmmade.ca"
								className="text-[#27BBFF] underline"
							>
								support@ohmmade.ca
							</a>
							.
						</p>
					</section>
				</LayoutContainer>
			</section>
		</div>
	);
}
