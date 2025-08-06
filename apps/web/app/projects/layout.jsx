import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the projects page
export const metadata = metadataGenerators.projects();

export default function ProjectsLayout({ children }) {
	return children;
}
