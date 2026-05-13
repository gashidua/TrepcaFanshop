import { Edit3, Minus, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  type: "",
  size: "",
  stock: 0,
  imageUrl: ""
};

export function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", minPrice: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).filter(Boolean),
    [products]
  );

  async function loadData(nextFilters = filters) {
    setError("");
    setLoading(true);
    try {
      const [productsData, cartData, statsData] = await Promise.all([
        api.getProducts(nextFilters),
        api.getCart(),
        api.getStats()
      ]);
      setProducts(productsData);
      setCart(cartData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitProduct(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (editingId) {
      await api.updateProduct(editingId, payload);
    } else {
      await api.createProduct(payload);
    }

    setForm(emptyProduct);
    setEditingId(null);
    await loadData();
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      type: product.type,
      size: product.size,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
  }

  async function removeProduct(id) {
    await api.deleteProduct(id);
    await loadData();
  }

  async function addToCart(productId) {
    await api.addToCart(productId, 1);
    const cartData = await api.getCart();
    setCart(cartData);
  }

  async function updateQuantity(id, quantity) {
    if (quantity < 1) return;
    await api.updateCartItem(id, quantity);
    const cartData = await api.getCart();
    setCart(cartData);
  }

  async function removeCartItem(id) {
    await api.removeCartItem(id);
    const cartData = await api.getCart();
    setCart(cartData);
  }

  async function applyFilters(event) {
    event.preventDefault();
    await loadData(filters);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">KB Trepca basketball club</p>
          <h1>KB Trepca Fanshop</h1>
          <p className="hero-copy">
            A matchday shop for Trepca supporters, built for jerseys, hoodies, accessories, and basketball gear.
          </p>
        </div>
        <div className="hero-stats" aria-label="Store statistics">
          <span>{stats?.count ?? 0} products</span>
          <strong>{formatCurrency(stats?.total ?? 0)}</strong>
          <small>Total inventory value</small>
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="workspace">
        <aside className="panel admin-panel">
          <h2>{editingId ? "Edit product" : "Add product"}</h2>
          <form onSubmit={submitProduct} className="product-form">
            <label>
              Name
              <input name="name" value={form.name} onChange={updateForm} required />
            </label>
            <label>
              Price
              <input name="price" type="number" step="0.01" value={form.price} onChange={updateForm} required />
            </label>
            <label>
              Category
              <input name="category" value={form.category} onChange={updateForm} required />
            </label>
            <div className="form-grid">
              <label>
                Type
                <input name="type" value={form.type} onChange={updateForm} />
              </label>
              <label>
                Size
                <input name="size" value={form.size} onChange={updateForm} />
              </label>
            </div>
            <label>
              Stock
              <input name="stock" type="number" min="0" value={form.stock} onChange={updateForm} />
            </label>
            <label>
              Image URL
              <input name="imageUrl" value={form.imageUrl} onChange={updateForm} />
            </label>
            <div className="actions">
              <button type="submit">{editingId ? "Save changes" : "Add product"}</button>
              {editingId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyProduct);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </aside>

        <section className="shop-area">
          <form className="toolbar" onSubmit={applyFilters}>
            <label className="search-field">
              <Search size={18} />
              <input
                placeholder="Search products"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              />
            </label>
            <select
              value={filters.category}
              onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))}
            />
            <button type="submit">Filter</button>
          </form>

          {loading ? (
            <div className="empty-state">Loading fanshop...</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.imageUrl || fallbackImage} alt={product.name} />
                  <div className="product-body">
                    <div>
                      <span className="category-pill">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.type || "Standard"} / {product.size || "One size"} / {product.stock} in stock</p>
                    </div>
                    <div className="product-footer">
                      <strong>{formatCurrency(product.price)}</strong>
                      <div className="icon-actions">
                        <button title="Add to cart" onClick={() => addToCart(product.id)}>
                          <ShoppingBag size={18} />
                        </button>
                        <button title="Edit product" onClick={() => editProduct(product)}>
                          <Edit3 size={18} />
                        </button>
                        <button title="Delete product" onClick={() => removeProduct(product.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="panel cart-panel">
          <h2>Matchday basket</h2>
          <div className="cart-list">
            {cart.items.length === 0 && <p className="muted">No products in the matchday basket.</p>}
            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <strong>{item.product.name}</strong>
                  <span>{formatCurrency(item.product.price)}</span>
                </div>
                <div className="quantity-controls">
                  <button title="Decrease" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button title="Increase" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                  <button title="Remove" onClick={() => removeCartItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatCurrency(cart.total)}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

const fallbackImage =
  "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80";
