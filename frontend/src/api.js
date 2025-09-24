// ATENÇÃO: Substitua pela URL real do seu backend.
const API_URL = "http://localhost:3001/api";

// --- Funções de Autenticação ---

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};

export const register = async (name, email, password, role) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};


// --- Funções de Produtos ---

export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};

// PREENCHIDO: Função para buscar um único produto pelo seu ID
export const getProductById = async (productId) => {
    const response = await fetch(`${API_URL}/products/${productId}`);
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};

// PREENCHIDO: Função para buscar os produtos do vendedor logado
export const getSellerProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/my-products`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};

// PREENCHIDO: Função para CADASTRAR UM PRODUTO (dados de texto)
export const registerProduct = async (productData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data; // Retorna o produto com o ID
};

// PREENCHIDO: Função para ENVIAR IMAGENS para um produto que já existe
export const uploadImages = async (productId, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${productId}/images`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};

// PREENCHIDO: Função para deletar um produto
export const deleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        const data = await response.json();
        throw { status: response.status, body: data };
    }
    return { success: true };
};


// --- Funções de Vendas e Pedidos ---

export const finalizarCompra = async (orderData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};

export const getSellerSales = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, body: data };
    return data;
};