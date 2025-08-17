import { metadataGenerators } from '@/lib/seo';
import getPrismaClient from '@/prisma/client';

// Generate static params for all users
export async function generateStaticParams() {
	const prisma = getPrismaClient();

	try {
		const users = await prisma.user.findMany({
			where: {
				NOT: {
					username: null,
				},
			},
			select: {
				username: true,
			},
		});

		return users.map((user) => ({
			username: user.username,
		}));
	} catch (error) {
		console.error('Error generating static params for users:', error);
		return [];
	}
}

// Generate metadata for user profile pages
export async function generateMetadata({ params }) {
	const { username } = await params;

	try {
		const prisma = getPrismaClient();

		// Get user data directly from database
		const user = await prisma.user.findUnique({
			where: { username },
			select: {
				name: true,
				username: true,
				image: true,
				bio: true,
			},
		});

		if (user) {
			// Use actual name if available, otherwise fallback to username
			const displayName = user.name || username;
			const title = `${displayName} (${username}) | OhmMade`;

			return {
				title,
				description: `Discover ${displayName}'s electronics projects and tutorials on OhmMade. Explore their latest builds, tutorials, and contributions to the maker community.`,
				keywords: [
					displayName,
					username,
					'electronics maker',
					'project creator',
					'tutorial author',
					'maker profile',
				],
				openGraph: {
					title,
					description: `Discover ${displayName}'s electronics projects and tutorials on OhmMade. Explore their latest builds, tutorials, and contributions to the maker community.`,
					url: `https://ohmmade.ca/u/${username}`,
					type: 'profile',
					images: user.image ? [user.image] : undefined,
				},
				twitter: {
					card: 'summary_large_image',
					title,
					description: `Discover ${displayName}'s electronics projects and tutorials on OhmMade.`,
					images: user.image ? [user.image] : undefined,
				},
			};
		}
	} catch (error) {
		console.error('Error generating metadata for user:', username, error);
	}

	// Fallback if database access fails or user not found
	return {
		title: `${username} | OhmMade`,
		description: `Discover ${username}'s electronics projects and tutorials on OhmMade. Explore their latest builds, tutorials, and contributions to the maker community.`,
		keywords: [
			username,
			'electronics maker',
			'project creator',
			'tutorial author',
			'maker profile',
		],
		openGraph: {
			title: `${username} | OhmMade`,
			description: `Discover ${username}'s electronics projects and tutorials on OhmMade. Explore their latest builds, tutorials, and contributions to the maker community.`,
			url: `https://ohmmade.ca/u/${username}`,
			type: 'profile',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${username} | OhmMade`,
			description: `Discover ${username}'s electronics projects and tutorials on OhmMade.`,
		},
	};
}

export default function UserProfileLayout({ children }) {
	return children;
}
