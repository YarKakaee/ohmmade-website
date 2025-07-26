'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminAuthModal from './components/AdminAuthModal';
import AdminDashboard from './components/AdminDashboard';
import AdminList from './components/AdminList';

export default function AdminPage() {
	const [user, setUser] = useState(null);
	const [currentAdmin, setCurrentAdmin] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [view, setView] = useState('dashboard'); // 'dashboard' or 'admin-list'
	const supabase = createClientComponentClient();

	useEffect(() => {
		// Check for existing session
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.user) {
				// Check if user is admin using API route
				try {
					const response = await fetch(
						'/api/auth/check-admin-status-prisma',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ email: session.user.email }),
						}
					);

					const result = await response.json();

					if (response.ok && result.isAdmin) {
						setUser(session.user);
						setCurrentAdmin(result.admin);
					} else {
						// Not an admin, show auth modal
						setShowAuthModal(true);
					}
				} catch (error) {
					console.error('Error checking admin status:', error);
					// On error, show auth modal
					setShowAuthModal(true);
				}
			} else {
				// No session, show auth modal
				setShowAuthModal(true);
			}
			setLoading(false);
		};

		checkSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN' && session?.user) {
				// Check if user is admin using API route
				try {
					const response = await fetch(
						'/api/auth/check-admin-status-prisma',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ email: session.user.email }),
						}
					);

					const result = await response.json();

					if (response.ok && result.isAdmin) {
						setUser(session.user);
						setCurrentAdmin(result.admin);
						setShowAuthModal(false);
					} else {
						// Not an admin, sign out
						await supabase.auth.signOut();
						setShowAuthModal(true);
					}
				} catch (error) {
					console.error('Error checking admin status:', error);
					// On error, sign out and show auth modal
					await supabase.auth.signOut();
					setShowAuthModal(true);
				}
			} else if (event === 'SIGNED_OUT') {
				setUser(null);
				setCurrentAdmin(null);
				setShowAuthModal(true);
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth]);

	const handleAuthSuccess = (userData) => {
		setUser(userData);
		setCurrentAdmin(userData.admin);
		setShowAuthModal(false);
		setView('dashboard');
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setCurrentAdmin(null);
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
	if (user && currentAdmin) {
		return (
			<div className="min-h-screen bg-[#101014]">
				{view === 'dashboard' ? (
					<AdminDashboard
						currentAdmin={currentAdmin}
						onSignOut={handleSignOut}
						onViewAdmins={() => setView('admin-list')}
					/>
				) : (
					<AdminList
						currentAdmin={currentAdmin}
						onBack={() => setView('dashboard')}
					/>
				)}
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
