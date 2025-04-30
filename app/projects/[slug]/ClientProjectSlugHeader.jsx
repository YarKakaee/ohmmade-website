'use client';

import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import ProjectSlugHeader from '@/app/components/common/ProjectSlugHeader';
import AuthModal from '@/app/components/auth/AuthModal';

export default function ClientProjectSlugHeader({ project }) {
	const session = useSession();
	const [showAuthModal, setShowAuthModal] = useState(false);

	return (
		<>
			<ProjectSlugHeader
				project={project}
				user={session?.user || null}
				setAuthModalOpen={setShowAuthModal}
			/>
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</>
	);
}
