import React from 'react';

// O "children" é uma propriedade especial que representa o conteúdo
// que será passado para dentro do componente.
export default function Wrapper({ children }) {
  return (
    <div className="border-4 border-red-500 p-4">
      {children}
    </div>
  );
}
