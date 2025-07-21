'use client';

import { useState } from 'react';
import Nav from './components/layout/Nav';
import HeroSection from './components/HeroSection';
import SearchResults from './components/SearchResults';

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

	return (
		<main className="min-h-screen bg-[#101014]">
			<div className="relative">
				<HeroSection
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					searchResults={searchResults}
					setSearchResults={setSearchResults}
					isSearchSubmitted={isSearchSubmitted}
					setIsSearchSubmitted={setIsSearchSubmitted}
				/>
				<SearchResults
					results={searchResults}
					searchQuery={searchQuery}
					isVisible={isSearchSubmitted}
				/>
			</div>
		</main>
	);
}
