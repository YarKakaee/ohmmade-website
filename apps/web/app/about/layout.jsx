import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the about page
export const metadata = metadataGenerators.about();

export default function AboutLayout({ children }) {
	return children;
}
