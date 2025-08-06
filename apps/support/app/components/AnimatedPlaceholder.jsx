'use client';

import { useMemo } from 'react';
import { useTypewriter } from 'react-simple-typewriter';

// Mobile-friendly phrases (keep under 30 characters for mobile)
const mobilePhrases = [
	'Ask about your circuit...',
	'Need help debugging?',
	'How to upload images?',
	'LED resistor values?',
	'Publishing guidelines?',
	'How does leveling work?',
	'Common error fixes...',
	'Microcontroller help?',
	'Start a discussion...',
	'Link GitHub repo?',
	'Track project stats?',
	'Why was it flagged?',
	'Edit or delete post?',
	'Embed YouTube videos?',
	'Account settings?',
	'Getting featured?',
	'Marked as duplicate?',
	'Change profile picture?',
	'Upload thumbnails?',
	'Follow creators?',
	'Experience levels?',
	'Filter projects?',
	'Report comments?',
	'View history?',
	'Comment not showing?',
	'Change project URL?',
	'Best tags to use?',
	'Delete account?',
	"Can't like posts?",
	'Moderation help?',
	'Suggest features?',
	'Bookmark projects?',
	'Submit bugs?',
	'Re-publish projects?',
	'Organize collections?',
	'Private projects?',
	'Reply notifications?',
	'Accepted answers?',
	'Markdown guide?',
	'Upload files?',
	'Post not in search?',
	'Highlight tutorial steps?',
	'Comment removed?',
	'Add collaborators?',
	'Track engagement?',
	'Ranking system?',
	'Question guidelines?',
	'Past announcements?',
	'Verify account?',
];

// Full-length phrases for desktop
const desktopPhrases = [
	'Ask a question about your circuit...',
	'Need help debugging your Raspberry Pi project?',
	'How do I upload images to my tutorial?',
	"What's the resistor value for a 3.3V LED?",
	'Find help with publishing guidelines...',
	'How does leveling work on OhmMade?',
	'Search common errors and community fixes...',
	'Need help with a specific microcontroller?',
	'Start a discussion with the OhmMade community...',
	'How do I link a GitHub repo to my project?',
	'Where can I track my project stats?',
	'Why was my project flagged?',
	'How do I edit or delete a post?',
	'Can I embed YouTube videos in my tutorial?',
	'Where do I manage my account settings?',
	'What are the rules for getting featured?',
	'Why was my post marked as duplicate?',
	'How do I change my profile picture?',
	'Can I upload multiple thumbnails for a project?',
	'How do I follow another creator?',
	'What counts toward my experience level?',
	'Can I filter projects by device or difficulty?',
	'How do I report an inappropriate comment?',
	'Where do I view my contribution history?',
	"Why isn't my comment showing up?",
	'Can I change my project URL slug?',
	'What tags should I use for better visibility?',
	'How do I delete my OhmMade account?',
	"Why can't I like a post?",
	'How do I request help with moderation?',
	'Where can I suggest a new feature for OhmMade?',
	'Is there a way to bookmark a project?',
	'Where do I submit bugs or platform issues?',
	'Can I re-publish an older project with updates?',
	'How do I organize my projects into collections?',
	'Can I make a project private?',
	'How do I get notified when someone replies to my question?',
	'What happens when I mark an answer as "Accepted"?',
	'Is there a markdown guide for tutorials?',
	'Can I upload files like .zip or .ino?',
	"Why didn't my new post show up in search?",
	'Can I highlight steps in my tutorial?',
	'Why was my comment removed?',
	'Can I assign collaborators to my project?',
	'How do I track views and likes over time?',
	'Is there a leaderboard or ranking system?',
	'What are the guidelines for posting questions?',
	'Where can I find past announcements or updates?',
	'How do I verify my account?',
];

export default function AnimatedPlaceholder() {
	// Determine if we're on mobile based on window width
	const isMobile = useMemo(() => {
		if (typeof window === 'undefined') return false;
		return window.innerWidth < 768; // md breakpoint in Tailwind
	}, []);

	// Choose phrases based on screen size
	const phrasesToUse = isMobile ? mobilePhrases : desktopPhrases;

	// Shuffle the phrases array only once when component mounts
	const shuffledPhrases = useMemo(() => {
		return [...phrasesToUse].sort(() => Math.random() - 0.5);
	}, [phrasesToUse]);

	const [text] = useTypewriter({
		words: shuffledPhrases,
		loop: true,
		typeSpeed: 50,
		deleteSpeed: 30,
		delaySpeed: 2000,
	});

	return (
		<span className="text-white/60 text-sm sm:text-base truncate whitespace-nowrap">
			{text}
			<span
				className="text-white/60"
				style={{
					animation: 'blink 1s infinite',
				}}
			>
				|
			</span>
			<style jsx>{`
				@keyframes blink {
					0%,
					50% {
						opacity: 1;
					}
					51%,
					100% {
						opacity: 0;
					}
				}
			`}</style>
		</span>
	);
}
