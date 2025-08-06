import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the publishing guidelines article page
export const metadata = metadataGenerators.publishingGuidelines();

export default function PublishingGuidelinesLayout({ children }) {
	return children;
}
