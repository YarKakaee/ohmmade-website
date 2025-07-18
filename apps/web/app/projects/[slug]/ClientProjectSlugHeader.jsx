'use client';

import { useEffect, useState } from 'react';
import { useAuthModal } from '@ohmmade/providers';
import ProjectSlugHeader from '@/app/components/common/ProjectSlugHeader';
import LayoutContainer from '@/app/components/common/LayoutContainer';

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
