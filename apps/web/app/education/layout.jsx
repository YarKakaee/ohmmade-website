import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the education page
export const metadata = metadataGenerators.education();

export default function EducationLayout({ children }) {
	return children;
} 