import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the privacy policy page
export const metadata = metadataGenerators.privacy();

export default function PrivacyLayout({ children }) {
	return children;
}
