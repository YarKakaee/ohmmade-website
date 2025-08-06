import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the watts and leveling article page
export const metadata = metadataGenerators.wattsGuide();

export default function WattsGuideLayout({ children }) {
	return children;
}
