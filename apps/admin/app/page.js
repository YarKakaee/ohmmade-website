'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminAuthModal from './components/AdminAuthModal';

export default function AdminDashboard() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const supabase = createClientComponentClient();

	useEffect(() => {
		// Check for existing session
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session && session.user?.email === 'info@ohmmade.ca') {
				setUser(session.user);
			} else {
				// No valid admin session, show auth modal
				setShowAuthModal(true);
			}
			setLoading(false);
		};

		checkSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (
				event === 'SIGNED_IN' &&
				session?.user?.email === 'info@ohmmade.ca'
			) {
				setUser(session.user);
				setShowAuthModal(false);
			} else if (event === 'SIGNED_OUT') {
				setUser(null);
				setShowAuthModal(true);
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth]);

	const handleAuthSuccess = (user) => {
		setUser(user);
		setShowAuthModal(false);
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setShowAuthModal(true);
	};

	// Show loading while checking authentication
	if (loading) {
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	// Show admin dashboard if authenticated and is admin
	if (user) {
		return (
			<div className="min-h-screen bg-[#101014]">
				<div className="container mx-auto px-4 py-8">
					<div className="mb-8 flex justify-between items-start">
						<div>
							<h1 className="text-4xl font-bold text-white mb-2">
								Admin Dashboard
							</h1>
							<p className="text-white/70">
								Welcome back, {user.email}
							</p>
						</div>
						<button
							onClick={handleSignOut}
							className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
						>
							Sign Out
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Stats Cards */}
						<div className="bg-[#1A1A1E] border border-[#333333] rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-2">
								Total Users
							</h3>
							<p className="text-3xl font-bold text-[#27BBFF]">
								0
							</p>
							<p className="text-white/60 text-sm">
								Active users
							</p>
						</div>

						<div className="bg-[#1A1A1E] border border-[#333333] rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-2">
								Total Projects
							</h3>
							<p className="text-3xl font-bold text-[#27BBFF]">
								0
							</p>
							<p className="text-white/60 text-sm">
								Published projects
							</p>
						</div>

						<div className="bg-[#1A1A1E] border border-[#333333] rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-2">
								Total Views
							</h3>
							<p className="text-3xl font-bold text-[#27BBFF]">
								0
							</p>
							<p className="text-white/60 text-sm">
								Project views
							</p>
						</div>
					</div>

					<div className="mt-8">
						<div className="bg-[#1A1A1E] border border-[#333333] rounded-lg p-6">
							<h2 className="text-xl font-semibold text-white mb-4">
								Quick Actions
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<button className="bg-[#27BBFF] hover:bg-[#1E9FD8] text-white font-medium py-2 px-4 rounded-lg transition-colors">
									Manage Users
								</button>
								<button className="bg-[#27BBFF] hover:bg-[#1E9FD8] text-white font-medium py-2 px-4 rounded-lg transition-colors">
									Review Projects
								</button>
								<button className="bg-[#27BBFF] hover:bg-[#1E9FD8] text-white font-medium py-2 px-4 rounded-lg transition-colors">
									Analytics
								</button>
								<button className="bg-[#27BBFF] hover:bg-[#1E9FD8] text-white font-medium py-2 px-4 rounded-lg transition-colors">
									Settings
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show auth modal
	return (
		<div className="min-h-screen bg-[#101014] flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-white mb-4">
					Admin Access Required
				</h1>
				<p className="text-white/70">
					Please sign in to access the admin dashboard.
				</p>
			</div>
			<AdminAuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				onSuccess={handleAuthSuccess}
			/>
		</div>
	);
}
