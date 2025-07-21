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
								<strong>Recognition:</strong> Show off your
								expertise and contributions to the community.
							</li>
							<li>
								<strong>Trust:</strong> Higher levels help
								others know they can rely on your advice and
								projects.
							</li>
							<li>
								<strong>Features:</strong> Unlock special
								features, early access, or exclusive content.
							</li>
							<li>
								<strong>Community:</strong> Join exclusive
								groups or events for high-level members.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							6. Watts Multipliers
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Some activities give you bonus Watts! Here are ways
							to maximize your earning:
						</p>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								<strong>Quality Content:</strong> Well-written,
								detailed projects earn more Watts than basic
								ones.
							</li>
							<li>
								<strong>Community Help:</strong> Answering
								questions and helping others earns bonus Watts.
							</li>
							<li>
								<strong>Consistency:</strong> Regular activity
								and engagement builds momentum.
							</li>
							<li>
								<strong>Innovation:</strong> Unique or creative
								projects get extra recognition.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							7. Tracking Your Progress
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							You can see your Watts and level progress in several
							places:
						</p>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								<strong>Profile Page:</strong> Your current
								level and total Watts are displayed prominently.
							</li>
							<li>
								<strong>Activity Feed:</strong> See recent Watts
								earned from specific actions.
							</li>
							<li>
								<strong>Dashboard:</strong> Track your progress
								toward the next level.
							</li>
							<li>
								<strong>Badges Section:</strong> View all your
								earned achievements and what's next.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							8. Tips for Earning More Watts
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								<strong>Be Active:</strong> Regular engagement
								keeps your Watts growing steadily.
							</li>
							<li>
								<strong>Share Knowledge:</strong> Help others
								learn and you'll earn Watts while building the
								community.
							</li>
							<li>
								<strong>Create Quality:</strong> Take time to
								make your projects detailed and helpful.
							</li>
							<li>
								<strong>Engage Authentically:</strong> Real
								interactions earn more than just clicking
								around.
							</li>
							<li>
								<strong>Stay Consistent:</strong> Regular
								activity is better than occasional bursts.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							9. Community Impact
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Remember, Watts aren't just about numbers — they
							represent your positive impact on the OhmMade
							community. Every project you share, every question
							you answer, and every maker you inspire contributes
							to building a better learning environment for
							everyone.
						</p>
					</section>
					<section>
						<h2 className="text-2xl font-bold mb-3">
							10. Need Help?
						</h2>
						<p className="text-[#CCCCCC]">
							If you have questions about Watts, leveling, or
							badges, reach out to us at{' '}
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
