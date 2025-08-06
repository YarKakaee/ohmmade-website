import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the manifesto page
export const metadata = metadataGenerators.manifesto();

export default function ManifestoLayout({ children }) {
	return children;
}
