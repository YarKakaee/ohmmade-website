'use client';

import LayoutContainer from '@/app/components/common/LayoutContainer';
import { Inter_Tight } from 'next/font/google';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function ProfileGuidelinesPage() {
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
						Profile Guidelines
					</h1>
					<p className="text-[#BBBBBB]">Last updated: May 29, 2025</p>

					<section>
						<h2 className="text-2xl font-bold mb-3">1. Overview</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Your OhmMade profile is your public identity across
							the platform. It's what other users see when you
							publish projects, leave comments, or interact in the
							community. This page explains how your profile
							works, how to personalize it, and what guidelines
							you should follow to keep it authentic, safe, and
							valuable for everyone.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							2. Display Name
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Your display name is the name shown publicly
								across OhmMade, such as on your profile page,
								project listings, and community forums.
							</li>
							<li>
								You can change your display name at any time in
								your profile settings.
							</li>
							<li>
								Display names should reflect your identity or
								personal brand — keep them respectful and
								non-offensive.
							</li>
							<li>
								Avoid impersonating others or using misleading
								names.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							3. Username &amp; Profile Link
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Your username is your unique handle on OhmMade,
								shown as{' '}
								<span className="text-[#27BBFF]">
									ohmmade.ca/u/username
								</span>
								.
							</li>
							<li>
								Usernames must be unique (no two users can have
								the same one).
							</li>
							<li>
								They are used for tagging, profile links, and
								search.
							</li>
							<li>
								Choose a username that represents you
								professionally or creatively.
							</li>
							<li>
								You can change your username, but frequent
								changes can break saved links.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							4. Profile Picture
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Your profile picture gives your account
								personality!
							</li>
							<li>
								You can upload your own image or use one of
								OhmMade's default avatars.
							</li>
							<li>
								Please avoid uploading inappropriate or
								copyrighted images.
							</li>
							<li>
								For best quality, we recommend square images
								(minimum 400x400px).
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							5. Public Profile
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>Display name, username, and profile picture</li>
							<li>Your bio (if filled)</li>
							<li>Projects you've published</li>
							<li>
								Community activity (like comments, liked
								projects)
							</li>
						</ul>
						<p className="text-[#CCCCCC] mt-2">
							Other users can visit your profile page to learn
							more about you and follow your work.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							6. Privacy &amp; Safety
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Sensitive info (like your email) is never shown
								publicly.
							</li>
							<li>
								You control what projects you publish or keep
								private.
							</li>
							<li>
								If you encounter harassment or impersonation,
								report it to our support team immediately.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							7. Tips for a Great Profile
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>Use a high-quality profile photo or avatar</li>
							<li>
								Write a short, engaging bio about your interests
							</li>
							<li>
								Regularly share projects or updates to build
								your reputation
							</li>
							<li>
								Link your social media accounts (if you want to
								grow your reach)
							</li>
						</ul>
						<p className="text-[#CCCCCC] mt-2">
							Remember: OhmMade is a space for makers and
							learners. Keep your profile positive, respectful,
							and true to your work!
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">8. Support</h2>
						<p className="text-[#CCCCCC]">
							If you have any questions or need help with your
							profile, visit our Help Center or contact the
							OhmMade team at{' '}
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
