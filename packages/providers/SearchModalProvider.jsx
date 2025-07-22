'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import SearchModal from './SearchModal';

const SearchModalContext = createContext();

export function useSearchModal() {
	return useContext(SearchModalContext);
}

export default function SearchModalProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);
	const [mode, setMode] = useState('projects');

	const openSearchModal = useCallback((searchMode = 'projects') => {
		setMode(searchMode);
		setIsOpen(true);
	}, []);

	const closeSearchModal = useCallback(() => setIsOpen(false), []);

	return (
		<SearchModalContext.Provider
			value={{ isOpen, openSearchModal, closeSearchModal, mode }}
		>
			{children}
			<SearchModal
				isOpen={isOpen}
				onClose={closeSearchModal}
				mode={mode}
			/>
		</SearchModalContext.Provider>
	);
}
