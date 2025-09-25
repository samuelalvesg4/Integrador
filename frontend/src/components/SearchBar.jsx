import React from 'react';
import { FaSearch } from 'react-icons/fa';
// NOVO: Importe o arquivo CSS que vamos criar
import './SearchBar.css'; 

export default function SearchBar({ query, setQuery }) {
    return (
        // Usando classes CSS em vez de estilos inline
        <div className="search-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Pesquisa"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
            </div>
        </div>
    );
}