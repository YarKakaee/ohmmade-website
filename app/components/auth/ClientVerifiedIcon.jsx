// components/ClientVerifiedIcon.jsx
'use client';

import dynamic from 'next/dynamic';

const VerifiedIcon = dynamic(() => import('@mui/icons-material/Verified'), {
	ssr: false,
});
export default function ClientVerifiedIcon() {
	return <VerifiedIcon sx={{ fontSize: 16 }} />;
}
