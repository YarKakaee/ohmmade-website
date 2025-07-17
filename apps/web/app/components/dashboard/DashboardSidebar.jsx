'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faFolderOpen,
	faHeart,
	faBookmark,
	faBook,
	faGear,
	faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function DashboardSidebar({ user, currentPath }) {
	const router = useRouter();
	const supabaseClient = useSupabaseClient();

	const handleSignOut = async () => {
		await router.push('/');
		await supabaseClient.auth.signOut();
		setTimeout(() => {
			window.location.reload();
		}, 200);
	};

	const isActive = (path) => {
		return currentPath === path;
	};

	return (
		<div className="w-[280px] pt-24 pr-8">
			<div className="flex flex-col items-center mb-8">
				<div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#3A3A3C]/60 mb-4">
					<Image
						src={user.image || '/default-avatar.png'}
						alt={user.name}
						width={96}
						height={96}
						className="object-cover w-full h-full"
					/>
				</div>
				<h2 className="text-xl font-bold text-white mb-1">
					{user.name}
				</h2>
				<p className="text-sm text-white/60">@{user.username}</p>
			</div>

			<nav className="space-y-2">
				<Link
					href="/dashboard"
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
						isActive('/dashboard')
							? 'text-[#101014] bg-[#27BBFF] font-medium'
							: 'text-white/60 hover:text-white hover:bg-white/5'
					}`}
				>
					<FontAwesomeIcon icon={faUser} />
					Overview
				</Link>
				<Link
					href="/dashboard/projects"
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
						isActive('/dashboard/projects')
							? 'text-[#101014] bg-[#27BBFF] font-medium'
							: 'text-white/60 hover:text-white hover:bg-white/5'
					}`}
				>
					<FontAwesomeIcon icon={faFolderOpen} />
					My Projects
				</Link>
				<Link
					href="/dashboard/liked"
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
						isActive('/dashboard/liked')
							? 'text-[#101014] bg-[#27BBFF] font-medium'
							: 'text-white/60 hover:text-white hover:bg-white/5'
					}`}
				>
					<FontAwesomeIcon icon={faHeart} />
					Liked Projects
				</Link>
				<Link
					href="/dashboard/saved"
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
						isActive('/dashboard/saved')
							? 'text-[#101014] bg-[#27BBFF] font-medium'
							: 'text-white/60 hover:text-white hover:bg-white/5'
					}`}
				>
					<FontAwesomeIcon icon={faBookmark} />
					Saved Projects
				</Link>
				<Link
					href="/dashboard/learning"
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
						isActive('/dashboard/learning')
							? 'text-[#101014] bg-[#27BBFF] font-medium'
							: 'text-white/60 hover:text-white hover:bg-white/5'
					}`}
				>
					<FontAwesomeIcon icon={faBook} />
					Learning Progress
				</Link>
				<Link
					href="/dashboard/settings"
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
						isActive('/dashboard/settings')
							? 'text-[#101014] bg-[#27BBFF] font-medium'
							: 'text-white/60 hover:text-white hover:bg-white/5'
					}`}
				>
					<FontAwesomeIcon icon={faGear} />
					Settings
				</Link>
				<button
					onClick={handleSignOut}
					className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full"
				>
					<FontAwesomeIcon icon={faRightFromBracket} />
					Sign Out
				</button>
			</nav>
		</div>
	);
}
