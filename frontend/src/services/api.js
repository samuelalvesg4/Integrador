const API = process.env.REACT_APP_API || 'http://localhost:4000/api';

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  
  const text = await res.text();
  let data;
  try { 
    data = text ? JSON.parse(text) : null; 
  } catch { 
    data = text; 
  }

  if (!res.ok) {
    const errorBody = data || text;
    const err = new Error(errorBody?.message || errorBody?.error || res.statusText || 'Erro na requisição');
    err.status = res.status;
    err.body = errorBody;
    throw err;
  }
  return data;
}

export async function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password, role) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function registerProduct(name, price, description, stock, images) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify({ name, price, description, stock, images }),
  });
}

export async function uploadImages(files) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não fornecido.');
  }
  
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  return request('/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getSellerProducts() {
  return request('/sellers/my-products', {
    method: 'GET',
  });
}

export async function getSellerSales() {
  return request('/sales', {
    method: 'GET',
  });
}

// CORREÇÃO: Função para buscar todos os produtos
export async function getProducts() {
  return request('/products');
}

// CORREÇÃO: Função para buscar um produto por ID
export async function getProductById(id) {
  return request(`/products/${id}`);
}