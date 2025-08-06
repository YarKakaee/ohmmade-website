import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the project publish page
export const metadata = metadataGenerators.publish();

export default function PublishLayout({ children }) {
	return children;
}
