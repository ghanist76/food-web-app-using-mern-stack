import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  MapPin,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Clock3,
  Star,
  X,
  LogOut,
  UserRound,
  Utensils,
  BadgePercent,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  QrCode,
  Home,
  Heart,
  MessageSquare,
  History,
  HelpCircle,
  Bell,
  Settings,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const categories = ["All", "FastFood", "Indian", "Snacks", "Chinese", "Desserts", "Drinks"];
const money = (n) => `₹${Number(n || 0).toFixed(0)}`;
const fallback = { FastFood: "🍔", Indian: "🍛", Snacks: "🥟", Chinese: "🍜", Desserts: "🍰", Drinks: "🥤" };
const restaurantForCategory = {
  FastFood: "Urban Bites",
  Indian: "Spice Route",
  Snacks: "Crispy Corner",
  Chinese: "Wok & Bowl",
  Desserts: "Sweet Crave",
  Drinks: "Sip & Savor",
};
const foodPhotoIds = {
  FastFood: ["photo-1568901346375-23c9450c58cd", "photo-1550317138-10000687a72b", "photo-1513104890138-7c749659a591", "photo-1548365328-9f547fb9587c", "photo-1576106672527-a0d69021c4d5", "photo-1613514785940-daed07799d9b", "photo-1565299624946-b28f40a0ae38", "photo-1550547660-d9450f859349"],
  Indian: ["photo-1603894584373-5ac82b2ae398", "photo-1631452180519-c014fe946bc7", "photo-1651602671034-9c91db59f045", "photo-1626697552845-29ad1a83d2c7", "photo-1604908176997-125f25cc6f3d", "photo-1547592180-85f173990554", "photo-1565557623262-b51c2513a641"],
  Snacks: ["photo-1601050690597-df0568f70950", "photo-1541592106381-b31e9677c0e5", "photo-1526318896980-cf78c088247c", "photo-1559847844-5315695dadae", "photo-1504674900247-0877df9cc836"],
  Chinese: ["photo-1512058564366-18510be2db19", "photo-1526318896980-cf78c088247c", "photo-1563245372-f21724e3856d", "photo-1569718212165-3a8278d5f624", "photo-1504674900247-0877df9cc836"],
  Desserts: ["photo-1578985545062-69928b1d9587", "photo-1551024601-bec78aea704b", "photo-1563805042-7684c019e1cb", "photo-1560008581-09826d1de69e", "photo-1488477181946-6428a0291777"],
  Drinks: ["photo-1622483767028-3f66f2b7420a", "photo-1546173159-315724a31696", "photo-1577805947697-89e18249d767", "photo-1495474472287-4d71bcdd2085", "photo-1513558161293-cdaf765edc40"],
};

function foodImageForItem(food) {
  const photos = foodPhotoIds[food.category];
  if (!photos?.length) return food.image ? encodeURI(food.image) : "";
  const key = `${food.name}-${food.restaurant || ""}`;
  const hash = [...key].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7);
  return `https://images.unsplash.com/${photos[hash % photos.length]}?auto=format&fit=crop&w=900&q=85`;
}

const defaultRestaurants = [
  { id: "r1", name: "Urban Bites", cuisine: "Burgers • Pizza • Wraps", rating: 4.8, eta: "20-30 min", deliveryFee: 29, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80" },
  { id: "r2", name: "Spice Route", cuisine: "Indian • Tandoori • Curries", rating: 4.9, eta: "25-35 min", deliveryFee: 35, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" },
  { id: "r3", name: "Crispy Corner", cuisine: "Snacks • Fries • Sides", rating: 4.6, eta: "15-25 min", deliveryFee: 19, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80" },
  { id: "r4", name: "Wok & Bowl", cuisine: "Chinese • Noodles • Rice", rating: 4.7, eta: "30-40 min", deliveryFee: 32, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80" },
  { id: "r5", name: "Sweet Crave", cuisine: "Desserts • Cakes • Shakes", rating: 4.8, eta: "20-25 min", deliveryFee: 20, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80" },
  { id: "r6", name: "Sip & Savor", cuisine: "Fresh Juice • Mocktails • Coffee", rating: 4.5, eta: "10-20 min", deliveryFee: 15, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80" },
];

const defaultOffers = [
  { id: "deal-1", title: "Burger Bonanza", description: "Buy any 2 burgers and get 20% off", badge: "20% OFF", icon: "🍔" },
  { id: "deal-2", title: "Family Feast", description: "3+ items and save 12% instantly", badge: "12% OFF", icon: "🎉" },
  { id: "deal-3", title: "Pizza + Soda", description: "Flavor match discount on pizza & drinks", badge: "SAVE ₹120", icon: "🍕" },
  { id: "deal-4", title: "Free Delivery", description: "Free delivery above ₹499", badge: "NO CHARGE", icon: "🚚" },
];

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function FoodImage({ food }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [food.name, food.category]);
  const src = foodImageForItem(food);

  return (
    <div className={`food-image ${failed || !src ? "image-fallback" : ""}`}>
      {src && !failed ? (
        <img src={src} alt={food.name} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span aria-label={food.category}>{fallback[food.category] || "🍽️"}</span>
      )}
      <span className={`veg-dot ${food.isVegetarian ? "veg" : "nonveg"}`} title={food.isVegetarian ? "Vegetarian" : "Non-vegetarian"} />
    </div>
  );
}

function PaymentQr() {
  const [available, setAvailable] = useState(true);
  const image = import.meta.env.VITE_PAYMENT_QR_IMAGE || "/payment-qr.png";

  return (
    <div className="payment-qr-card">
      {available ? (
        <img src={image} alt="Scan this QR code to pay" onError={() => setAvailable(false)} />
      ) : (
        <div className="qr-placeholder" aria-label="Payment QR image not added yet">
          <QrCode size={60} />
          <span>Add your QR image</span>
        </div>
      )}
      <div>
        <strong>Scan to pay</strong>
        <span>Pay with your UPI app. Verify the transfer before preparing the order; this app does not confirm payments automatically.</span>
      </div>
    </div>
  );
}

function CustomerOrderHistory({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const result = await request("/orders/my", { token });
      setOrders(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  return (
    <section className="customer-history-view">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow orange"><History size={15} /> YOUR ACCOUNT</span>
          <h1>Order history</h1>
          <p>Track your orders and revisit what you’ve enjoyed.</p>
        </div>
        <button className="admin-refresh" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div className="status-panel error-panel">{error}</div>}
      {loading && <div className="status-panel">Loading your orders…</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="history-empty">
          <span>🧾</span>
          <h2>No orders yet</h2>
          <p>Your completed checkouts will appear here.</p>
        </div>
      )}

      <div className="customer-order-list">
        {orders.map((order) => (
          <article className="customer-order-card" key={order._id}>
            <div className="customer-order-head">
              <div>
                <span>ORDER #{order._id.slice(-8).toUpperCase()}</span>
                <small>{new Date(order.createdAt).toLocaleString()}</small>
              </div>
              <span className={`customer-order-status status-${String(order.status).toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="customer-order-content">
              <div className="customer-order-items">
                {order.items.map((item, index) => (
                  <div className="customer-order-item" key={`${item.food || item.name}-${index}`}>
                    <span>{item.quantity} × {item.name}</span>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="customer-order-summary">
                <div><MapPin size={14} /><span>{order.address}</span></div>
                <div><CreditCard size={14} /><span>{order.paymentMethod === "DEMO" ? "UPI QR · manual verification" : "Cash on delivery"}</span></div>
                <div className="customer-order-total"><span>Total paid</span><strong>{money(order.finalTotal ?? order.total)}</strong></div>
                {order.offerName && <small className="customer-order-offer"><BadgePercent size={13} /> {order.offerName} · saved {money(order.discount)}</small>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuthModal({ mode, setMode, onClose, onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await request(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      onAuth(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal auth-modal">
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Close">
          <X />
        </button>
        <div className="brand-mark large">F</div>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="muted">Good food is just a few clicks away.</p>
        <form onSubmit={submit} className="form-stack">
          {mode === "register" && (
            <label>
              Full name
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>
          )}
          <label>
            {mode === "login" ? "Email or username" : "Email address"}
            <input type={mode === "login" ? "text" : "email"} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={mode === "login" ? "you@example.com or admin username" : "you@example.com"} />
          </label>
          <label>
            Password
            <input type="password" minLength={mode === "register" ? 8 : undefined} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "register" ? "At least 8 characters" : "Your password"} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Login" : "Register"}</button>
        </form>
        <p className="switch-auth">
          {mode === "login" ? "New to FoodExpress?" : "Already have an account?"}{" "}
          <button onClick={() => { setError(""); setMode(mode === "login" ? "register" : "login"); }}>
            {mode === "login" ? "Create account" : "Login"}
          </button>
        </p>
      </section>
    </div>
  );
}

function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const result = await request("/orders/admin", { token });
      setOrders(result.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  async function updateStatus(orderId, status) {
    setUpdatingId(orderId);
    setError("");
    try {
      const result = await request(`/orders/admin/${orderId}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status }),
      });
      setOrders((current) => current.map((order) => order._id === orderId ? result.order : order));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "All" || order.status === filter;
    const customer = typeof order.user === "object" ? order.user : {};
    const searchText = `${order._id} ${customer.name || ""} ${customer.email || ""} ${order.address || ""}`.toLowerCase();
    return matchesStatus && searchText.includes(search.toLowerCase());
  });
  const placedCount = orders.filter((order) => order.status === "Placed").length;
  const preparingCount = orders.filter((order) => order.status === "Preparing").length;
  const completedCount = orders.filter((order) => order.status === "Delivered").length;

  return (
    <section className="admin-orders-view">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow orange"><ShieldCheck size={15} /> ADMINISTRATION</span>
          <h1>Customer orders</h1>
          <p>Review delivery details, payment choices, and order progress.</p>
        </div>
        <button className="admin-refresh" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      <div className="admin-stats-grid">
        <article><span>All orders</span><strong>{orders.length}</strong><small>Customer submissions</small></article>
        <article><span>New orders</span><strong>{placedCount}</strong><small>Awaiting confirmation</small></article>
        <article><span>Preparing</span><strong>{preparingCount}</strong><small>In the kitchen</small></article>
        <article><span>Delivered</span><strong>{completedCount}</strong><small>Completed orders</small></article>
      </div>

      <div className="admin-orders-toolbar">
        <label className="admin-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, email, address, order ID" /></label>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter orders by status">
          <option>All</option><option>Placed</option><option>Preparing</option><option>Delivered</option><option>Cancelled</option>
        </select>
      </div>

      {error && <div className="status-panel error-panel">{error}</div>}
      {loading && <div className="status-panel">Loading customer orders…</div>}
      {!loading && !error && filteredOrders.length === 0 && <div className="status-panel">No orders match this view yet.</div>}

      <div className="admin-order-list">
        {filteredOrders.map((order) => {
          const customer = typeof order.user === "object" ? order.user : {};
          const paymentLabel = order.paymentMethod === "DEMO" ? "UPI QR · manual verification" : "Cash on delivery";
          return (
            <article className="admin-order-card" key={order._id}>
              <div className="admin-order-card-head">
                <div><span>ORDER #{order._id.slice(-8).toUpperCase()}</span><small>{new Date(order.createdAt).toLocaleString()}</small></div>
                <label className="status-select-label">Status
                  <select value={order.status} disabled={updatingId === order._id} onChange={(event) => updateStatus(order._id, event.target.value)}>
                    <option>Placed</option><option>Preparing</option><option>Delivered</option><option>Cancelled</option>
                  </select>
                </label>
              </div>
              <div className="admin-order-details">
                <section className="admin-customer-details">
                  <h3>Customer & delivery</h3>
                  <strong>{customer.name || "Customer account unavailable"}</strong>
                  {customer.email && <a href={`mailto:${customer.email}`}>{customer.email}</a>}
                  <div className="admin-address"><MapPin size={15} /><span>{order.address}</span></div>
                  <div className="admin-payment"><CreditCard size={15} /><span>{paymentLabel}</span></div>
                </section>
                <section className="admin-items-details">
                  <h3>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                  {order.items.map((item, index) => (
                    <div className="admin-item-row" key={`${item.food || item.name}-${index}`}>
                      <span>{item.quantity} × {item.name}</span><strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </section>
                <section className="admin-total-details">
                  <h3>Payment summary</h3>
                  <div><span>Subtotal</span><strong>{money(order.total)}</strong></div>
                  <div><span>Discount{order.offerName ? ` · ${order.offerName}` : ""}</span><strong className="saving">−{money(order.discount)}</strong></div>
                  <div className="admin-payable"><span>Order total</span><strong>{money(order.finalTotal)}</strong></div>
                </section>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getOfferSummary(subtotal, cart) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const burgerCount = cart.filter((item) => /burger|pizza/i.test(item.name)).reduce((sum, item) => sum + item.quantity, 0);
  const drinkCount = cart.filter((item) => /drink|cola|lassi|lemonade|coffee|juice/i.test(item.name)).reduce((sum, item) => sum + item.quantity, 0);

  if (subtotal >= 999) {
    return { title: "Mega Feast", discount: subtotal * 0.15, text: "15% off your basket", badge: "15% OFF" };
  }
  if (burgerCount >= 2 && drinkCount >= 1) {
    return { title: "Burger + Drink Combo", discount: Math.min(subtotal * 0.2, 220), text: "20% off on combo orders", badge: "20% OFF" };
  }
  if (itemCount >= 4) {
    return { title: "Family Bundle", discount: Math.min(subtotal * 0.12, 180), text: "12% savings on 4+ items", badge: "12% OFF" };
  }
  if (subtotal >= 499) {
    return { title: "Delivery Deal", discount: Math.min(subtotal * 0.08, 120), text: "Savings unlocked above ₹499", badge: "SAVE ₹120" };
  }
  return { title: "Add more items", discount: 0, text: "Spend ₹499+ to unlock savings", badge: "NEXT DEAL" };
}

function App() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState(defaultRestaurants);
  const [offers, setOffers] = useState(defaultOffers);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [category, setCategory] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState("All");
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("foodexpress_token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodexpress_user") || "null");
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState("");
  const [adminView, setAdminView] = useState(false);
  const [historyView, setHistoryView] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [liveLocation, setLiveLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notice, setNotice] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    Promise.all([
      request("/foods"),
      request("/foods/restaurants").catch(() => ({ restaurants: defaultRestaurants })),
      request("/foods/offers").catch(() => ({ offers: defaultOffers })),
    ])
      .then(([menu, restaurantData, offerData]) => {
        setRestaurants(restaurantData?.restaurants || defaultRestaurants);
        setFoods((menu || []).map((food) => ({
          ...food,
          restaurant: food.restaurant && food.restaurant !== "FoodExpress"
            ? food.restaurant
            : restaurantForCategory[food.category] || defaultRestaurants[0].name,
        })));
        setOffers(offerData?.offers || defaultOffers);
      })
      .catch((err) => setLoadError(`${err.message} Check that MongoDB and the backend are running.`))
      .finally(() => setLoading(false));
  }, []);

  const subtotal = cart.reduce((sum, row) => sum + row.price * row.quantity, 0);
  const count = cart.reduce((sum, row) => sum + row.quantity, 0);
  const offerSummary = useMemo(() => getOfferSummary(subtotal, cart), [subtotal, cart]);
  const discount = offerSummary.discount;
  const deliveryFee = subtotal > 0 && subtotal >= 499 ? 0 : subtotal > 0 ? 29 : 0;
  const payable = Math.max(subtotal - discount, 0) + deliveryFee;

  const visibleFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory = category === "All" || food.category === category;
      const matchesRestaurant = selectedRestaurant === "All" || food.restaurant?.trim().toLowerCase() === selectedRestaurant.trim().toLowerCase();
      const restaurant = restaurants.find((item) => item.name.toLowerCase() === (food.restaurant || "").toLowerCase());
      const searchableText = [food.name, food.restaurant, food.category, food.description, restaurant?.cuisine]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search.trim() || searchableText.includes(search.trim().toLowerCase());
      return matchesCategory && matchesRestaurant && matchesSearch;
    });
  }, [foods, category, search, selectedRestaurant, restaurants]);

  const searchSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return foods
      .filter((food) => {
        const restaurant = restaurants.find((item) => item.name.toLowerCase() === (food.restaurant || "").toLowerCase());
        return [food.name, food.restaurant, food.category, restaurant?.cuisine]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      })
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 6);
  }, [foods, restaurants, search]);

  function selectSearchSuggestion(food) {
    setSearch(food.name);
    setCategory("All");
    setSelectedRestaurant("All");
    setActiveSuggestion(0);
    setSearchFocused(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Escape") {
      setSearchFocused(false);
    } else if (event.key === "ArrowDown" && searchSuggestions.length) {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % searchSuggestions.length);
    } else if (event.key === "ArrowUp" && searchSuggestions.length) {
      event.preventDefault();
      setActiveSuggestion((current) => (current - 1 + searchSuggestions.length) % searchSuggestions.length);
    } else if (event.key === "Enter" && searchFocused && searchSuggestions.length) {
      event.preventDefault();
      selectSearchSuggestion(searchSuggestions[activeSuggestion] || searchSuggestions[0]);
    }
  }

  function authenticate(result) {
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("foodexpress_token", result.token);
    localStorage.setItem("foodexpress_user", JSON.stringify(result.user));
    setAuthMode("");
    setAdminView(false);
    setNotice(`Welcome, ${result.user.name}!`);
  }

  function logout() {
    setToken("");
    setUser(null);
    setAdminView(false);
    setHistoryView(false);
    localStorage.removeItem("foodexpress_token");
    localStorage.removeItem("foodexpress_user");
    setNotice("You have logged out.");
  }

  function add(food) {
    setCart((current) => {
      const existing = current.find((row) => row._id === food._id);
      return existing
        ? current.map((row) => (row._id === food._id ? { ...row, quantity: row.quantity + 1 } : row))
        : [...current, { ...food, quantity: 1 }];
    });
    setNotice(`${food.name} added to cart`);
  }

  function changeQty(id, delta) {
    setCart((current) => current.map((row) => (row._id === id ? { ...row, quantity: row.quantity + delta } : row)).filter((row) => row.quantity > 0));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setNotice("This browser does not support location access.");
      return;
    }

    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const coordinateAddress = `Delivery location: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
      let resolvedAddress = coordinateAddress;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`);
        if (response.ok) {
          const result = await response.json();
          resolvedAddress = result.display_name || coordinateAddress;
          const addressParts = result.address || {};
          setLiveLocation(addressParts.suburb || addressParts.neighbourhood || addressParts.city || addressParts.town || addressParts.village || "Current location");
        } else {
          setLiveLocation("Current location");
        }
      } catch {
        setLiveLocation("Current location");
      }

      setAddress(resolvedAddress);
      setNotice("Current location added to your delivery address. Please check it before ordering.");
      setLocating(false);
    }, (error) => {
      const message = error.code === 1
        ? "Location permission was denied. Allow location access in your browser and try again."
        : error.code === 2
          ? "Your current location could not be determined. Check your device location settings."
          : "Location request timed out. Please try again.";
      setNotice(message);
      setLocating(false);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!token) {
      setAuthMode("login");
      return;
    }
    if (!cart.length) return;
    setOrdering(true);
    setNotice("");
    try {
      const result = await request("/orders", {
        method: "POST",
        token,
        body: JSON.stringify({
          address,
          paymentMethod,
          items: cart.map((row) => ({ foodId: row._id, quantity: row.quantity })),
        }),
      });
      setNotice(`${result.message} Order ID: ${result.order._id}`);
      setCart([]);
      setAddress("");
      setCartOpen(false);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#" className="brand sidebar-brand">
          <span className="brand-mark">F</span>
          <span>Food<span className="brand-accent">Express</span></span>
        </a>
        <span className="sidebar-label">MENU</span>
        <nav className="side-nav" aria-label="Main navigation">
          <a className={!adminView && !historyView ? "active" : ""} href="#top" onClick={() => { setAdminView(false); setHistoryView(false); }}><Home size={17} /> Overview</a>
          <a href="#menu" onClick={() => { setAdminView(false); setHistoryView(false); }}><Utensils size={17} /> Food order</a>
          <a href="#restaurants" onClick={() => { setAdminView(false); setHistoryView(false); }}><Heart size={17} /> Favorites</a>
          <button onClick={() => setCartOpen(true)}><MessageSquare size={17} /> Messages</button>
          <button className={`history-nav-button ${historyView ? "active" : ""}`} onClick={() => {
            if (!token) {
              setAuthMode("login");
              return;
            }
            setAdminView(false);
            setHistoryView(true);
          }}><History size={17} /> Order history</button>
          <a href="#offers" onClick={() => { setAdminView(false); setHistoryView(false); }}><BadgePercent size={17} /> Offers</a>
          {user?.role === "admin" && (
            <button className={`admin-nav-button ${adminView ? "active" : ""}`} onClick={() => { setAdminView(!adminView); setHistoryView(false); }}>
              <LayoutDashboard size={17} /> {adminView ? "Back to menu" : "Admin orders"}
            </button>
          )}
        </nav>
        <div className="sidebar-promo">
          <Sparkles size={18} />
          <strong>Hungry for a deal?</strong>
          <span>Fresh combos and savings are waiting.</span>
          <a href="#offers">Explore offers <span>→</span></a>
        </div>
        <div className="sidebar-bottom">
          <a href="#help"><HelpCircle size={17} /> Help center</a>
          <button onClick={logout}><LogOut size={17} /> Log out</button>
        </div>
      </aside>
      <header className="topbar">
        <a href="#" className="brand">
          <span className="brand-mark">F</span>
          <span>
            Food<span className="brand-accent">Express</span>
            <small>GOOD FOOD. GOOD MOOD.</small>
          </span>
        </a>

        <div className="welcome-label" id="top">
          <small>GOOD FOOD, GOOD MOOD</small>
          <strong>Welcome{user ? ` back, ${user.name.split(" ")[0]}` : " to FoodExpress"}!</strong>
        </div>
        <button className="delivery-location location-button" type="button" onClick={useCurrentLocation} disabled={locating} aria-label="Use my current location">
          <MapPin size={18} />
          <span>
            <small>DELIVERING TO</small>
            <strong>{locating ? "Finding location…" : liveLocation || (address ? "Delivery address" : "Set location")}</strong>
          </span>
        </button>

        <div className="search-control">
          <label className="searchbox">
            <Search size={19} />
            <input
              aria-label="Search dishes, restaurants, and cuisines"
              aria-autocomplete="list"
              aria-expanded={searchFocused && Boolean(search.trim())}
              value={search}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChange={(event) => { setSearch(event.target.value); setActiveSuggestion(0); }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search for dishes, restaurants, cuisines..."
            />
            {search && <button type="button" className="search-clear" onClick={() => { setSearch(""); setActiveSuggestion(0); }} aria-label="Clear search"><X size={15} /></button>}
            <kbd>⌕</kbd>
          </label>
          {searchFocused && search.trim() && (
            <div className="search-suggestions" role="listbox" aria-label="Menu suggestions">
              {searchSuggestions.length ? searchSuggestions.map((food, index) => (
                <button
                  className={`search-suggestion ${index === activeSuggestion ? "active" : ""}`}
                  key={food._id}
                  type="button"
                  role="option"
                  aria-selected={index === activeSuggestion}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  onClick={() => selectSearchSuggestion(food)}
                >
                  <FoodImage food={food} />
                  <span className="suggestion-copy"><strong>{food.name}</strong><small>{food.restaurant} · {food.category}</small></span>
                  <strong className="suggestion-price">{money(food.price)}</strong>
                </button>
              )) : <div className="suggestion-empty">No matching menu items. Try another word.</div>}
            </div>
          )}
        </div>

        <div className="header-actions">
          <button className="icon-btn header-icon" aria-label="Notifications"><Bell size={17} /></button>
          <button className="icon-btn header-icon" aria-label="Settings"><Settings size={17} /></button>
          {user ? (
            <button className="plain-btn user-btn" onClick={logout}>
              <UserRound size={18} />
              <span>{user.name.split(" ")[0]}</span>
              <LogOut size={15} />
            </button>
          ) : (
            <button className="plain-btn" onClick={() => setAuthMode("login")}>Login</button>
          )}

          <button className="cart-button" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} />
            <span>Cart</span>
            <b>{count}</b>
          </button>
        </div>
      </header>

      <main>
        {adminView && user?.role === "admin" ? <AdminOrders token={token} /> : historyView && token ? <CustomerOrderHistory token={token} /> : (
        <div className="dashboard-grid">
          <div className="dashboard-main">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={15} /> YOUR CRAVINGS, DELIVERED
            </span>
            <h1>
              Good food.<br />
              <em>Great mood.</em>
            </h1>
            <p>Discover your favourites, find a new obsession, and let the good stuff come to you.</p>
            <button className="primary-btn" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
              Explore menu <span>→</span>
            </button>
            <div className="hero-perks">
              <span>
                <Clock3 size={16} /> Quick & easy ordering
              </span>
              <span>
                <Star size={16} fill="currentColor" /> Handpicked favourites
              </span>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-circle" />
            <div className="hero-emoji">🍔</div>
            <div className="floating-chip chip-one">✨ Fresh picks</div>
            <div className="floating-chip chip-two">❤️ Made with love</div>
            <div className="hero-small-emoji">🍟</div>
            <div className="hero-small-emoji two">🥤</div>
          </div>
        </section>

        <section className="stats-strip">
          <div><strong>900+</strong><span>Curated menu items</span></div>
          <div><strong>6</strong><span>Popular restaurants</span></div>
          <div><strong>15 min</strong><span>Fast delivery slots</span></div>
          <small>Live deals, real-like checkout, and combo savings.</small>
        </section>

        <section className="offer-strip" id="offers">
          <div className="section-heading">
            <div>
              <span className="eyebrow orange">
                <BadgePercent size={15} /> SPECIAL OFFERS
              </span>
              <h2>Smart savings for every craving</h2>
            </div>
          </div>
          <div className="deal-grid">
            {offers.map((offer) => (
              <article className="deal-card" key={offer.id}>
                <div className="deal-icon">{offer.icon}</div>
                <div>
                  <span>{offer.badge}</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="restaurant-section" id="restaurants">
          <div className="section-heading">
            <div>
              <span className="eyebrow orange">
                <Utensils size={15} /> POPULAR RESTAURANTS
              </span>
              <h2>Best spots near you</h2>
            </div>
          </div>
          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                className={`restaurant-card ${selectedRestaurant === restaurant.name ? "selected" : ""}`}
                onClick={() => {
                  setSelectedRestaurant(selectedRestaurant === restaurant.name ? "All" : restaurant.name);
                  setCategory("All");
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="restaurant-card-body">
                  <div className="restaurant-head">
                    <h3>{restaurant.name}</h3>
                    <span className="rating-badge">
                      <Star size={12} fill="currentColor" /> {restaurant.rating}
                    </span>
                  </div>
                  <p>{restaurant.cuisine}</p>
                  <div className="restaurant-meta">
                    <span>{restaurant.eta}</span>
                    <span>₹{restaurant.deliveryFee} delivery</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading menu-title">
            <div>
              <span className="eyebrow orange">MADE TO MAKE YOU HUNGRY</span>
              <h2>Explore our menu</h2>
              <p>Something delicious for every kind of craving.</p>
            </div>
            <span className="result-count">{visibleFoods.length} items</span>
          </div>

          <div className="category-row">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`category-pill ${category === item ? "active" : ""}`}>
                {item === "All" ? "🍽️" : fallback[item]} {item === "FastFood" ? "Fast Food" : item}
              </button>
            ))}
            {selectedRestaurant !== "All" && (
              <button className="category-pill active" onClick={() => setSelectedRestaurant("All")}>
                {selectedRestaurant} <X size={13} />
              </button>
            )}
            {search && <button className="category-pill clear-filters" onClick={() => { setSearch(""); setCategory("All"); setSelectedRestaurant("All"); }}>Clear filters</button>}
          </div>

          {loading && <div className="status-panel">Loading delicious things…</div>}
          {loadError && (
            <div className="status-panel error-panel">
              <strong>Could not load the menu</strong>
              <p>{loadError}</p>
            </div>
          )}
          {!loading && !loadError && visibleFoods.length === 0 && <div className="status-panel">No items found. Try another search or category.</div>}

          <div className="food-grid">
            {visibleFoods.map((food) => (
              <article className="food-card" key={`${food.name}-${food.price}-${food.restaurant}`}>
                <FoodImage food={food} />
                <div className="food-card-content">
                  <div className="food-title-row">
                    <h3>{food.name}</h3>
                    <span className="rating">
                      <Star size={12} fill="currentColor" /> {food.rating || 4.5}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span>{food.restaurant}</span>
                    <span>{food.deliveryTime || "30-40 min"}</span>
                  </div>
                  <p className="food-description">{food.description || "A delicious pick, freshly prepared."}</p>
                  <div className="food-card-bottom">
                    <strong>{money(food.price)}</strong>
                    <button className="add-btn" onClick={() => add(food)} aria-label={`Add ${food.name} to cart`}>
                      <Plus size={17} /> ADD
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
          </div>
          <aside className="order-panel">
            <div className="balance-card">
              <span>Your balance</span>
              <strong>{money(payable)}</strong>
              <small>{count ? `${count} item${count === 1 ? "" : "s"} in your basket` : "Your basket is waiting"}</small>
              <div className="balance-actions"><span><CreditCard size={16} /> Payments</span><span><BadgePercent size={16} /> Offers</span></div>
            </div>
            <div className="order-panel-heading">
              <div><span>YOUR BASKET</span><h2>Order menu</h2></div>
              <button onClick={() => setCartOpen(true)}>Edit</button>
            </div>
            {cart.length ? (
              <div className="panel-order-lines">
                {cart.slice(0, 4).map((item) => (
                  <div className="panel-order-line" key={item._id}>
                    <FoodImage food={item} />
                    <div><strong>{item.name}</strong><span>×{item.quantity}</span></div>
                    <b>{money(item.price * item.quantity)}</b>
                  </div>
                ))}
                {cart.length > 4 && <small>+ {cart.length - 4} more delicious picks</small>}
              </div>
            ) : (
              <div className="panel-empty"><span>🍽️</span><strong>No items yet</strong><small>Add a favorite dish to start your order.</small></div>
            )}
            <div className="panel-totals">
              <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
              <div><span>Combo savings</span><b className="saving">−{money(discount)}</b></div>
              <div><span>Delivery</span><b>{deliveryFee ? money(deliveryFee) : "FREE"}</b></div>
              <div className="panel-grand-total"><span>Total</span><b>{money(payable)}</b></div>
            </div>
            <button className="primary-btn full panel-checkout" onClick={() => setCartOpen(true)}>
              {cart.length ? "Review & checkout" : "Start an order"} <span>→</span>
            </button>
            <div className="panel-trust"><ShieldCheck size={15} /> Easy checkout · Secure payment</div>
          </aside>
        </div>
        )}
      </main>

      <footer>
        <a href="#" className="brand">
          <span className="brand-mark">F</span>
          <span>
            Food<span className="brand-accent">Express</span>
          </span>
        </a>
        <p>A food delivery app with restaurant discovery, combo offers, and UPI QR payment instructions.</p>
        <span>© {new Date().getFullYear()} FoodExpress • Made for the love of food.</span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}

      {authMode && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setAuthMode("")} onAuth={authenticate} />}

      {cartOpen && (
        <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setCartOpen(false)}>
          <aside className="cart-drawer">
            <div className="drawer-heading">
              <div>
                <span className="eyebrow orange">YOUR ORDER</span>
                <h2>Your cart ({count})</h2>
              </div>
              <button className="icon-btn" onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>

            {!cart.length ? (
              <div className="empty-cart">
                <span>🛍️</span>
                <h3>Your cart is hungry</h3>
                <p>Add something delicious from the menu.</p>
                <button className="primary-btn" onClick={() => setCartOpen(false)}>Explore menu</button>
              </div>
            ) : (
              <>
                <div className="checkout-progress">
                  <span className={token ? "done" : ""}>
                    <CheckCircle2 size={14} /> Login
                  </span>
                  <span className={address ? "done" : ""}>
                    <MapPin size={14} /> Address
                  </span>
                  <span className={paymentMethod ? "done" : ""}>
                    <CreditCard size={14} /> Payment
                  </span>
                </div>

                <div className="cart-lines">
                  {cart.map((row) => (
                    <div className="cart-line" key={row._id}>
                      <FoodImage food={row} />
                      <div className="cart-line-main">
                        <strong>{row.name}</strong>
                        <span>{money(row.price)}</span>
                        <div className="quantity-control">
                          <button onClick={() => changeQty(row._id, -1)} aria-label="Decrease quantity">
                            <Minus size={14} />
                          </button>
                          <span>{row.quantity}</span>
                          <button onClick={() => changeQty(row._id, 1)} aria-label="Increase quantity">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => setCart((current) => current.filter((item) => item._id !== row._id))} aria-label={`Remove ${row.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="offer-box">
                  <div className="offer-topline">
                    <BadgePercent size={14} /> {offerSummary.badge}
                  </div>
                  <strong>{offerSummary.title}</strong>
                  <span>{offerSummary.text}</span>
                </div>

                <form className="checkout-form" onSubmit={placeOrder}>
                  <label>
                    Delivery address
                    <textarea required minLength="8" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / flat, street, area, city, PIN code" />
                  </label>
                  <button type="button" className="checkout-location-button" onClick={useCurrentLocation} disabled={locating}>
                    <MapPin size={14} /> {locating ? "Finding your location…" : "Use my current location"}
                  </button>

                  <label>
                    Payment option
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="COD">Cash on delivery</option>
                      <option value="DEMO">Online payment by QR</option>
                    </select>
                  </label>

                  {paymentMethod === "DEMO" && <PaymentQr />}

                  <div className="secure-row">
                    <ShieldCheck size={15} /> Payment transfers are verified manually
                  </div>

                  <div className="bill-box">
                    <div className="bill-row"><span>Items</span><strong>{money(subtotal)}</strong></div>
                    <div className="bill-row"><span>Offer</span><strong>-{money(discount)}</strong></div>
                    <div className="bill-row"><span>Delivery</span><strong>{deliveryFee === 0 ? "FREE" : money(deliveryFee)}</strong></div>
                    <div className="bill-row grand-total"><span>Total</span><strong>{money(payable)}</strong></div>
                  </div>

                  <button className="primary-btn full" disabled={ordering}>{ordering ? "Placing order…" : `Place order · ${money(payable)}`}</button>
                  {!user && <small className="muted">You’ll be asked to log in before placing an order.</small>}
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;