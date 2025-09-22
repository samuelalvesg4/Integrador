// frontend/src/hooks/useUser.js
import { useState, useEffect } from 'react';

export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Função que lê o localStorage e atualiza o estado
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        // Roda a função uma vez quando o componente é montado
        checkUser();

        // Adiciona um "ouvinte" que recarrega os dados do usuário
        // sempre que um evento 'userChanged' for disparado (no login/logout)
        window.addEventListener('userChanged', checkUser);

        // Função de "limpeza": remove o ouvinte para evitar problemas de memória
        return () => {
            window.removeEventListener('userChanged', checkUser);
        };
    }, []);

    return user;
}