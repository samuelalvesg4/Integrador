// frontend/src/services/api.js

const API = process.env.REACT_APP_API || 'http://localhost:4000/api';

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  
  const isFormData = options.body instanceof FormData;
  
  const headers = { 
    ...(options.headers || {}) 
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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

export async function registerProduct(productData) {
    // O backend precisa retornar o objeto completo do produto com o ID
    return request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
}

export async function uploadImages(files, productId) {
    if (!localStorage.getItem('token')) {
        throw new Error('Token não fornecido.');
    }

    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });

    return request(`/products/${productId}/images`, { // Novo endpoint com o ID
        method: 'POST',
        body: formData,
    });
}

export async function editProduct(id, productData) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }
  
export async function deleteProduct(id) {
      return request(`/products/${id}`, {
          method: 'DELETE',
      });
  }

export async function getSellerProducts() {
  return request('/my-products', {
    method: 'GET',
  });
}

export async function getSellerSales() {
  return request('/sales', {
    method: 'GET',
  });
}

export async function getProducts() {
  return request('/products');
}

export async function getProductById(id) {
  return request(`/products/${id}`);
}

export async function finalizarCompra(orderData) {
  return request('/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}