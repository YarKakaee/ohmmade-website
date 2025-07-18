'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@ohmmade/providers';

export default function SignInPage() {
	const router = useRouter();
	const { openAuthModal } = useAuthModal();

	useEffect(() => {
		router.replace('/');
		setTimeout(() => openAuthModal('login'), 200);
	}, [router, openAuthModal]);

	return <div className="fixed inset-0 bg-[#101014] z-50" />;
}
