const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

let authToken = localStorage.getItem("trepca_token") || "";

export function setAuthToken(token) {
  authToken = token || "";
  if (authToken) {
    localStorage.setItem("trepca_token", authToken);
  } else {
    localStorage.removeItem("trepca_token");
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request("/auth/me"),
  getProducts: (params = {}) => {
    const search = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== "" && value != null)
    );
    return request(`/products${search.size ? `?${search}` : ""}`);
  },
  getStats: () => request("/products/stats"),
  createProduct: (product) =>
    request("/products", {
      method: "POST",
      body: JSON.stringify(product)
    }),
  updateProduct: (id, product) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product)
    }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),
  getCart: () => request("/cart"),
  addToCart: (productId, quantity = 1) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity })
    }),
  updateCartItem: (id, quantity) =>
    request(`/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }),
  removeCartItem: (id) => request(`/cart/${id}`, { method: "DELETE" }),
  createOrder: () => request("/orders", { method: "POST" }),
  getOrders: () => request("/orders"),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    })
};
