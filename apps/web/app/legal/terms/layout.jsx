import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the terms of service page
export const metadata = metadataGenerators.terms();

export default function TermsLayout({ children }) {
	return children;
}
