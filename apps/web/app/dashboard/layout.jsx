import { metadataGenerators } from '@/lib/seo';

// Generate metadata for the dashboard page
export const metadata = metadataGenerators.dashboard();

export default function DashboardLayout({ children }) {
	return children;
}
