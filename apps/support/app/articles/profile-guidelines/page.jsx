'use client';

import LayoutContainer from '@ohmmade/ui/layout-container';
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
								Your profile picture gives your account a visual
								identity and helps others recognize you.
							</li>
							<li>
								Use a clear, high-quality image that represents
								you well.
							</li>
							<li>
								Keep it appropriate and professional — avoid
								offensive or inappropriate content.
							</li>
							<li>
								You can update your profile picture at any time
								from your settings.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							5. Bio &amp; Description
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Your bio is a short description that appears on
								your profile page.
							</li>
							<li>
								Use it to share your interests, expertise, or
								what you're working on.
							</li>
							<li>
								Keep it concise and relevant to the OhmMade
								community.
							</li>
							<li>
								Avoid sharing personal contact information or
								sensitive details.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							6. Privacy &amp; Safety
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Your profile is public by default, meaning
								anyone can view it.
							</li>
							<li>
								Don't share personal information like your full
								name, address, phone number, or email in your
								profile.
							</li>
							<li>
								Be mindful of what you share — your profile
								represents you to the community.
							</li>
							<li>
								If you need to report inappropriate content or
								behavior, use the report function.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							7. Community Guidelines
						</h2>
						<ul className="list-disc pl-6 text-[#CCCCCC] space-y-2">
							<li>
								Be respectful and inclusive in your profile
								content.
							</li>
							<li>
								Avoid hate speech, harassment, or discriminatory
								language.
							</li>
							<li>
								Don't use your profile to spam, advertise, or
								promote inappropriate content.
							</li>
							<li>
								Respect intellectual property — don't use
								copyrighted images or content without
								permission.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							8. Profile Activity
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							Your profile page shows your recent activity,
							including published projects, comments, and
							interactions. This helps others understand your
							contributions to the community and discover your
							work.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-3">
							9. Getting Help
						</h2>
						<p className="text-[#CCCCCC] leading-relaxed">
							If you have questions about your profile or need
							help with settings, you can contact our support team
							or check our other help articles. We're here to help
							you make the most of your OhmMade experience.
						</p>
					</section>
				</LayoutContainer>
			</section>
		</div>
	);
}
