import React from 'react';
import './footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 md:mb-0">
                    <p className="text-lg font-bold">Loja SEMD © Seu marketplace de confiança</p>
                </div>
                <div>
                    <p className="text-sm"> {currentYear} Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}