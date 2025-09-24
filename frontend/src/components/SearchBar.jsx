import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css'; // 1. Importe o arquivo CSS

export default function SearchBar({ query, setQuery }) {
    return (
        // 2. Substitua os 'style' por 'className'
        <div className="search-bar-wrapper">
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Pesquisar produtos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
            </div>
        </div>
    );
}