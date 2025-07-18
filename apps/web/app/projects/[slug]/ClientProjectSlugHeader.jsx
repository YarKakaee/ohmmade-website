'use client';

import ProjectSlugHeader from '@/app/components/common/ProjectSlugHeader';
import { useAuthModal } from '@ohmmade/providers';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { useSession } from '@supabase/auth-helpers-react';

export default function ClientProjectSlugHeader({ project }) {
	const session = useSession();
	const { openAuthModal } = useAuthModal();

	return (
		<LayoutContainer>
			<ProjectSlugHeader
				project={project}
				user={session?.user || null}
				setAuthModalOpen={openAuthModal}
			/>
		</LayoutContainer>
	);
}
