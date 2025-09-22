import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ query, setQuery }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <div style={{ position: 'relative', width: '40rem' }}>
                <input
                    type="text"
                    style={{
                        display: 'block',
                        width: '100%',
                        borderRadius: '9999px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#fff',
                        padding: '1rem',
                        fontSize: '1rem',
                        color: '#4b5563',
                        outline: 'none',
                    }}
                    placeholder="Pesquisa"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <FaSearch
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '1rem',
                        transform: 'translateY(-50%)',
                        height: '1.5rem',
                        width: '1.5rem',
                        color: '#6b7280',
                    }}
                />
            </div>
        </div>
    );
}