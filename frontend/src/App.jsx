import { Edit3, LogOut, Minus, PackageCheck, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "./api.js";

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
  const [auth, setAuth] = useState(() => {
    const user = localStorage.getItem("trepca_user");
    return user ? { user: JSON.parse(user) } : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", minPrice: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = auth?.user?.role === "admin";
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).filter(Boolean),
    [products]
  );

  useEffect(() => {
    if (auth?.user) loadData();
  }, [auth?.user?.id]);

  async function loadData(nextFilters = filters) {
    setError("");
    setLoading(true);
    try {
      const productsData = await api.getProducts(nextFilters);
      setProducts(productsData);

      if (isAdmin) {
        const [ordersData, statsData] = await Promise.all([api.getOrders(), api.getStats()]);
        setOrders(ordersData);
        setStats(statsData);
      } else {
        const [cartData, ordersData] = await Promise.all([api.getCart(), api.getOrders()]);
        setCart(cartData);
        setOrders(ordersData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitAuth(event) {
    event.preventDefault();
    setError("");
    try {
      const result =
        authMode === "login"
          ? await api.login({ email: authForm.email, password: authForm.password })
          : await api.register(authForm);

      setAuthToken(result.token);
      localStorage.setItem("trepca_user", JSON.stringify(result.user));
      setAuth({ user: result.user });
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    setAuth(null);
    setAuthToken("");
    localStorage.removeItem("trepca_user");
    setProducts([]);
    setCart({ items: [], total: 0 });
    setOrders([]);
  }

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
    setCart(await api.getCart());
  }

  async function updateQuantity(id, quantity) {
    if (quantity < 1) return;
    await api.updateCartItem(id, quantity);
    setCart(await api.getCart());
  }

  async function removeCartItem(id) {
    await api.removeCartItem(id);
    setCart(await api.getCart());
  }

  async function checkout() {
    await api.createOrder();
    const [cartData, orderData, productData] = await Promise.all([api.getCart(), api.getOrders(), api.getProducts(filters)]);
    setCart(cartData);
    setOrders(orderData);
    setProducts(productData);
  }

  async function updateStatus(id, status) {
    await api.updateOrderStatus(id, status);
    setOrders(await api.getOrders());
  }

  async function applyFilters(event) {
    event.preventDefault();
    await loadData(filters);
  }

  if (!auth?.user) {
    return (
      <main className="login-page">
        <section className="login-hero">
          <p className="eyebrow">KB Trepca basketball club</p>
          <h1>KB Trepca Fanshop</h1>
          <p>Login to shop match tickets, jerseys, merchandise, and supporter gear.</p>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <span>{authMode === "login" ? "Welcome back" : "Create account"}</span>
            <h2>{authMode === "login" ? "Sign in to continue" : "Join the fanshop"}</h2>
          </div>

          <div className="auth-tabs">
            <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
              Login
            </button>
            <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
              Register
            </button>
          </div>

          {error && <div className="alert compact">{error}</div>}

          <form onSubmit={submitAuth} className="product-form">
            {authMode === "register" && (
              <label>
                Name
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={authForm.email}
                onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>
            <button type="submit">{authMode === "login" ? "Login" : "Create account"}</button>
          </form>

          <p className="login-note">Admin and user demo credentials are listed in the project README.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">{isAdmin ? "Admin dashboard" : "Supporter shop"}</p>
          <h1>{isAdmin ? "Manage KB Trepca Fanshop" : "KB Trepca Fanshop"}</h1>
          <p className="hero-copy">
            {isAdmin
              ? "Add merchandise, control stock, and follow every supporter order."
              : "Shop tickets, jerseys, accessories, and basketball gear for matchday."}
          </p>
        </div>
        <div className="hero-stats" aria-label="Account panel">
          <span>{auth.user.role}</span>
          <strong>{auth.user.name}</strong>
          <button className="logout-button" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      {isAdmin ? (
        <AdminView
          products={products}
          stats={stats}
          orders={orders}
          form={form}
          editingId={editingId}
          loading={loading}
          onFormChange={updateForm}
          onSubmitProduct={submitProduct}
          onEditProduct={editProduct}
          onRemoveProduct={removeProduct}
          onCancelEdit={() => {
            setEditingId(null);
            setForm(emptyProduct);
          }}
          onUpdateStatus={updateStatus}
        />
      ) : (
        <UserView
          products={products}
          cart={cart}
          orders={orders}
          filters={filters}
          categories={categories}
          loading={loading}
          onFilterChange={setFilters}
          onApplyFilters={applyFilters}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          onRemoveCartItem={removeCartItem}
          onCheckout={checkout}
        />
      )}
    </main>
  );
}

function AdminView(props) {
  return (
    <section className="admin-layout">
      <aside className="panel admin-panel">
        <h2>{props.editingId ? "Edit product" : "Add product"}</h2>
        <ProductForm {...props} />
      </aside>

      <section className="admin-main">
        <div className="metric-row">
          <Metric label="Products" value={props.stats?.count ?? 0} />
          <Metric label="Inventory value" value={formatCurrency(props.stats?.inventoryValue ?? 0)} />
          <Metric label="Orders" value={props.orders.length} />
        </div>

        <div className="table-panel">
          <h2>Products</h2>
          <div className="admin-product-list">
            {props.products.map((product) => (
              <div className="admin-product-row" key={product.id}>
                <img src={product.imageUrl || fallbackImage} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category} / {product.stock} in stock / {formatCurrency(product.price)}</span>
                </div>
                <div className="icon-actions">
                  <button title="Edit product" onClick={() => props.onEditProduct(product)}>
                    <Edit3 size={18} />
                  </button>
                  <button title="Delete product" onClick={() => props.onRemoveProduct(product.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <OrdersPanel orders={props.orders} isAdmin onUpdateStatus={props.onUpdateStatus} />
      </section>
    </section>
  );
}

function ProductForm({
  form,
  editingId,
  onFormChange,
  onSubmitProduct,
  onCancelEdit
}) {
  return (
    <form onSubmit={onSubmitProduct} className="product-form">
      <label>
        Name
        <input name="name" value={form.name} onChange={onFormChange} required />
      </label>
      <label>
        Price
        <input name="price" type="number" step="0.01" value={form.price} onChange={onFormChange} required />
      </label>
      <label>
        Category
        <input name="category" value={form.category} onChange={onFormChange} required />
      </label>
      <div className="form-grid">
        <label>
          Type
          <input name="type" value={form.type} onChange={onFormChange} />
        </label>
        <label>
          Size
          <input name="size" value={form.size} onChange={onFormChange} />
        </label>
      </div>
      <label>
        Stock
        <input name="stock" type="number" min="0" value={form.stock} onChange={onFormChange} />
      </label>
      <label>
        Image URL
        <input name="imageUrl" value={form.imageUrl} onChange={onFormChange} />
      </label>
      <div className="actions">
        <button type="submit">{editingId ? "Save changes" : "Add product"}</button>
        {editingId && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function UserView(props) {
  return (
    <section className="workspace">
      <section className="shop-area">
        <form className="toolbar" onSubmit={props.onApplyFilters}>
          <label className="search-field">
            <Search size={18} />
            <input
              placeholder="Search tickets, jerseys, merch"
              value={props.filters.search}
              onChange={(event) => props.onFilterChange((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
          <select
            value={props.filters.category}
            onChange={(event) => props.onFilterChange((current) => ({ ...current, category: event.target.value }))}
          >
            <option value="">All categories</option>
            {props.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Min price"
            value={props.filters.minPrice}
            onChange={(event) => props.onFilterChange((current) => ({ ...current, minPrice: event.target.value }))}
          />
          <button type="submit">Filter</button>
        </form>

        {props.loading ? (
          <div className="empty-state">Loading fanshop...</div>
        ) : (
          <div className="product-grid">
            {props.products.map((product) => (
              <article className="product-card" key={product.id}>
                <img src={product.imageUrl || fallbackImage} alt={product.name} />
                <div className="product-body">
                  <div>
                    <span className="category-pill">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.type || "Standard"} / {product.size || "One size"} / {product.stock} available</p>
                  </div>
                  <div className="product-footer">
                    <strong>{formatCurrency(product.price)}</strong>
                    <button onClick={() => props.onAddToCart(product.id)}>
                      <ShoppingBag size={18} /> Add
                    </button>
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
          {props.cart.items.length === 0 && <p className="muted">No products in the matchday basket.</p>}
          {props.cart.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <strong>{item.product.name}</strong>
                <span>{formatCurrency(item.product.price)}</span>
              </div>
              <div className="quantity-controls">
                <button title="Decrease" onClick={() => props.onUpdateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button title="Increase" onClick={() => props.onUpdateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
                <button title="Remove" onClick={() => props.onRemoveCartItem(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <span>Total</span>
          <strong>{formatCurrency(props.cart.total)}</strong>
        </div>
        <button className="checkout-button" disabled={!props.cart.items.length} onClick={props.onCheckout}>
          <PackageCheck size={18} /> Place order
        </button>

        <OrdersPanel orders={props.orders} />
      </aside>
    </section>
  );
}

function OrdersPanel({ orders, isAdmin = false, onUpdateStatus }) {
  return (
    <div className="table-panel orders-panel">
      <h2>{isAdmin ? "Orders" : "My orders"}</h2>
      {orders.length === 0 && <p className="muted">No orders yet.</p>}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div className="order-header">
            <div>
              <strong>Order #{order.id}</strong>
              <span>{isAdmin ? `${order.customerName} / ${order.customerEmail}` : new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity} x {item.productName} / {formatCurrency(item.unitPrice)}
              </li>
            ))}
          </ul>
          <div className="order-footer">
            <strong>{formatCurrency(order.total)}</strong>
            {isAdmin && (
              <select value={order.status} onChange={(event) => onUpdateStatus(order.id, event.target.value)}>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

const fallbackImage =
  "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80";
