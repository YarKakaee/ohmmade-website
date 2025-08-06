import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the profile guidelines article page
export const metadata = metadataGenerators.profileGuidelines();

export default function ProfileGuidelinesLayout({ children }) {
	return children;
}
