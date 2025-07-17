'use client';

import { useSession } from '@supabase/auth-helpers-react';
import ProjectSlugHeader from '@/app/components/common/ProjectSlugHeader';
import LayoutContainer from '@/app/components/common/LayoutContainer';
import { useAuthModal } from '@/app/providers/AuthModalProvider';

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
