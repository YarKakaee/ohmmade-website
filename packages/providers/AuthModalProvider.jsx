'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import AuthModal from './AuthModal';

const AuthModalContext = createContext();

export function useAuthModal() {
	return useContext(AuthModalContext);
}

export default function AuthModalProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);
	const [mode, setMode] = useState('login');

	const openAuthModal = useCallback((authMode = 'login') => {
		setMode(authMode);
		setIsOpen(true);
	}, []);

	const closeAuthModal = useCallback(() => setIsOpen(false), []);

	return (
		<AuthModalContext.Provider
			value={{ isOpen, openAuthModal, closeAuthModal, mode }}
		>
			{children}
			<AuthModal isOpen={isOpen} onClose={closeAuthModal} mode={mode} />
		</AuthModalContext.Provider>
	);
}
