import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  CreditCard,
  Download,
  CalendarDays,
  Edit3,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Ticket,
  Trash2,
  Users,
  Warehouse
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const LOW_STOCK_THRESHOLD = 20;
const JERSEY_LOW_STOCK_THRESHOLD = 4;

const MATCH_TIME_OPTIONS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:15",
  "20:30",
  "21:00",
  "21:30",
  "22:00"
];

const jerseyColors = ["E zezë", "E bardhë"];

const defaultJerseyVariantSeed = [
  ["0", "Gashi", 8],
  ["1", "Haliti", 8],
  ["3", "Payne", 6],
  ["7", "Tuna", 10],
  ["8", "Zekiqi", 7],
  ["11", "Tmusic", 9],
  ["12", "Hajrizi", 6],
  ["21", "Jones", 5],
  ["22", "Brown", 5],
  ["23", "Amzil", 7],
  ["35", "Dardan Kapiti", 4]
];

function isJersey(product) {
  return product?.id === "jersey";
}

function slugifyJerseyName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function createJerseyVariant(number, name, stock = 0) {
  const cleanNumber = String(number).trim();
  const cleanName = String(name).trim();
  return {
    id: `jv-${cleanNumber}-${slugifyJerseyName(cleanName)}`,
    number: cleanNumber,
    name: cleanName,
    stock: Math.max(0, Number(stock) || 0)
  };
}

function defaultJerseyVariants() {
  return defaultJerseyVariantSeed.map(([number, name, stock]) => createJerseyVariant(number, name, stock));
}

function enrichJerseyVariant(variant) {
  return createJerseyVariant(variant.number, variant.name, variant.stock);
}

function jerseyVariantLabel(variant) {
  return `${variant.number} - ${variant.name}`;
}

function jerseyTotalStock(variants) {
  return variants.reduce((sum, variant) => sum + variant.stock, 0);
}

function getJerseyVariants(product) {
  if (!isJersey(product)) return [];
  if (Array.isArray(product.jerseyVariants) && product.jerseyVariants.length) {
    return product.jerseyVariants.map(enrichJerseyVariant);
  }
  return defaultJerseyVariants();
}

function findJerseyVariant(product, valueOrId) {
  if (!valueOrId) return null;
  return getJerseyVariants(product).find(
    (variant) => variant.id === valueOrId || jerseyVariantLabel(variant) === valueOrId
  );
}

function firstAvailableJerseyVariant(product) {
  return getJerseyVariants(product).find((variant) => variant.stock > 0) || null;
}

function normalizeJerseyVariantsForSave(variants) {
  const cleaned = (variants || [])
    .map((variant) => ({
      ...enrichJerseyVariant(variant),
      number: String(variant.number ?? "").trim(),
      name: String(variant.name ?? "").trim()
    }))
    .filter((variant) => variant.number && variant.name);

  const seenNumbers = new Set();
  return cleaned.filter((variant) => {
    if (seenNumbers.has(variant.number)) return false;
    seenNumbers.add(variant.number);
    return true;
  });
}

const defaultProducts = [
  ["jersey", "Trepça Jersey", 25, "Clothing", "/trepca-assets/dresa.png", 45],
  ["shorts", "Trepça Shorts", 20, "Clothing", "/trepca-assets/shorce.png", 38],
  ["duks", "Trepça Duks", 30, "Clothing", "/trepca-assets/duksi.png", 22],
  ["maice", "Trepça Maicë", 15, "Clothing", "/trepca-assets/maica.png", 55],
  ["shall", "Trepça Shall", 10, "Accessories", "/trepca-assets/shalli.png", 18],
  ["cap", "Trepça Cap", 8, "Accessories", "/trepca-assets/cap.png", 12],
  ["cante", "Trepça Çantë Sportive", 25, "Accessories", "/trepca-assets/canta.png", 15],
  ["bottle", "Trepça Bottle", 10, "Equipment", "/trepca-assets/shishja.png", 40]
].map(([id, name, price, category, imageUrl, stock]) => {
  const product = { id, name, price, category, imageUrl, stock };
  if (id === "jersey") {
    const jerseyVariants = defaultJerseyVariants();
    return { ...product, jerseyVariants, stock: jerseyTotalStock(jerseyVariants) };
  }
  return product;
});

const homeImages = ["/trepca-assets/tf.png"];

const aboutImages = [
  "/trepca-assets/tf1.png",
  "/trepca-assets/tf2.png",
  "/trepca-assets/tf3.png",
  "/trepca-assets/tf4.png"
];

const TREPCA_CLUB = {
  id: "trepca",
  shortName: "Trepça",
  fullName: "KB Trepca",
  arenaName: "Palestra «Minatori»",
  imageUrl: "/arena-assets/minatori-kb-trepca.png"
};

const LEAGUE_CLUBS = [
  {
    id: "bashkimi",
    shortName: "Bashkimi",
    fullName: "KB Bashkimi",
    arenaName: "Palestra «Sezai Surroi»",
    imageUrl: "/arena-assets/sezai-surroi-kb-bashkimi.png"
  },
  {
    id: "ylli",
    shortName: "Ylli",
    fullName: "KB Golden Eagle Ylli",
    arenaName: "Palestra «13 Qershori»",
    imageUrl: "/arena-assets/13-qershori-golden-eagle-ylli.png"
  },
  {
    id: "prishtina",
    shortName: "Prishtina",
    fullName: "KB Sigal Prishtina",
    arenaName: "Pallati i Rinisë dhe Sporteve",
    imageUrl: "/arena-assets/pallati-i-rinise-dhe-sporteve-kb-sigal-prishtina.png"
  },
  {
    id: "vellaznimi",
    shortName: "Vëllaznimi",
    fullName: "KB Vëllaznimi",
    arenaName: "Palestra «Shani Nushi»",
    imageUrl: "/arena-assets/shani-nushi-kb-vellaznimi.png"
  },
  {
    id: "peja",
    shortName: "Peja",
    fullName: "KB Peja",
    arenaName: "Palestra «Karagaçi»",
    imageUrl: "/arena-assets/karagaci-kb-peja.png"
  },
  {
    id: "istogu",
    shortName: "Istogu",
    fullName: "KB Istogu",
    arenaName: "Pallati i Sporteve «Istogu»",
    imageUrl: "/arena-assets/pallati-i-sporteve-istogu-kb-istogu.png"
  },
  {
    id: "rahoveci",
    shortName: "Rahoveci",
    fullName: "KB Rahoveci",
    arenaName: "Palestra «Mizahir Isma»",
    imageUrl: "/arena-assets/mizahir-isma-kb-rahoveci.png"
  },
  {
    id: "bora",
    shortName: "Bora",
    fullName: "KB Bora",
    arenaName: "Pallati i Rinisë dhe Sporteve",
    imageUrl: "/arena-assets/pallati-i-rinise-dhe-sporteve-kb-bora.png"
  }
];

const ALL_CLUBS = [TREPCA_CLUB, ...LEAGUE_CLUBS];

function getClubById(id) {
  return ALL_CLUBS.find((club) => club.id === id) || null;
}

function getClubByShortName(shortName) {
  return ALL_CLUBS.find((club) => club.shortName === shortName) || null;
}

function parseDateLabelToIso(label) {
  const months = {
    janar: "01",
    shkurt: "02",
    mars: "03",
    prill: "04",
    maj: "05",
    qershor: "06",
    korrik: "07",
    gusht: "08",
    shtator: "09",
    tetor: "10",
    nentor: "11",
    nëntor: "11",
    dhjetor: "12"
  };
  const match = String(label || "").toLowerCase().match(/^(\d{1,2})\s+([a-zçë]+)\s+(\d{4})$/i);
  if (!match) return "";
  const [, day, month, year] = match;
  if (!months[month]) return "";
  return `${year}-${months[month]}-${day.padStart(2, "0")}`;
}

function clubSelectLabel(club) {
  return `${club.fullName} — ${club.arenaName}`;
}

function enrichMatch(match) {
  const venueClub = match.venueClub || match.home;
  const club = getClubByShortName(venueClub) || TREPCA_CLUB;
  const opponent =
    getClubById(match.opponentClubId) ||
    (match.home === TREPCA_CLUB.shortName
      ? getClubByShortName(match.away)
      : getClubByShortName(match.home));
  const dateIso = match.dateIso || parseDateLabelToIso(match.date);
  const date = match.date || (dateIso ? formatDateLabel(dateIso) : "");

  return {
    ...match,
    dateIso,
    date,
    venueClub: club.shortName,
    arenaName: match.arenaName || club.arenaName,
    arenaImageUrl: match.arenaImageUrl || club.imageUrl,
    opponentClubId: match.opponentClubId || opponent?.id || null,
    trepcaSide:
      match.trepcaSide ||
      (match.home === TREPCA_CLUB.shortName ? "home" : match.away === TREPCA_CLUB.shortName ? "away" : "home")
  };
}

function buildMatchFromAdminForm({ opponentClubId, trepcaSide, dateIso, time }) {
  const opponent = getClubById(opponentClubId);
  if (!opponent || !dateIso?.trim()) return null;

  const home = trepcaSide === "home" ? TREPCA_CLUB.shortName : opponent.shortName;
  const away = trepcaSide === "home" ? opponent.shortName : TREPCA_CLUB.shortName;
  const host = getClubByShortName(home) || TREPCA_CLUB;
  const iso = dateIso.trim();

  return enrichMatch({
    id: `m-${Date.now()}`,
    home,
    away,
    dateIso: iso,
    date: formatDateLabel(iso),
    time: time.trim() || "19:00",
    opponentClubId: opponent.id,
    trepcaSide,
    venueClub: host.shortName,
    arenaName: host.arenaName,
    arenaImageUrl: host.imageUrl
  });
}

const defaultMatches = [
  { id: "m1", home: "Trepça", away: "Prishtina", dateIso: "2026-06-06", time: "19:00" },
  { id: "m2", home: "Peja", away: "Trepça", dateIso: "2026-06-13", time: "20:00" },
  { id: "m3", home: "Ylli", away: "Trepça", dateIso: "2026-06-20", time: "19:30" },
  { id: "m4", home: "Bashkimi", away: "Trepça", dateIso: "2026-06-27", time: "20:15" },
  { id: "m5", home: "Rahoveci", away: "Trepça", dateIso: "2026-07-04", time: "19:00" },
  { id: "m6", home: "Istogu", away: "Trepça", dateIso: "2026-07-11", time: "20:00" },
  { id: "m7", home: "Vëllaznimi", away: "Trepça", dateIso: "2026-07-18", time: "19:30" },
  { id: "m8", home: "Prishtina", away: "Trepça", dateIso: "2026-07-25", time: "20:15" }
];

const defaultTicketTypes = [
  { id: "single", name: "Biletë për një ndeshje", price: 5 },
  { id: "season", name: "Biletë sezonale", price: 60 },
  { id: "year", name: "Biletë vjetore", price: 120 }
];

const ticketPassDetails = {
  season: {
    title: "Për krejt sezonin në Minatori",
    description: "Bileta sezonale është për tifozët që duan ta ndjekin Trepçën rregullisht në ndeshjet kryesore të sezonit. Me një blerje e ke qasjen të ruajtur në llogari dhe QR kodi gjenerohet menjëherë pas pagesës.",
    perks: ["Qasje për ndeshjet vendase të sezonit", "QR kod i ruajtur te biletat e tua", "Më pak hapa sa herë afrohet ndeshja", "E përshtatshme për tifozët që vijnë shpesh"]
  },
  year: {
    title: "Paketë vjetore për tifozët më të rregullt",
    description: "Bileta vjetore është zgjedhja më e plotë për ata që duan ta kenë Trepçën afër gjatë gjithë vitit. Përfshin qasje më të gjatë dhe e bën blerjen më të thjeshtë sepse bileta mbetet e ruajtur në profil.",
    perks: ["Qasje për periudhë më të gjatë", "Biletë digjitale me QR kod", "Ruhet në listën e biletave të gjeneruara", "Zgjedhje praktike për tifozë të përhershëm"]
  }
};

const sizes = ["S", "M", "L", "XL"];

const accountsStorageKey = "trepca_accounts";
const accountDataPrefix = "trepca_account_data_";
const catalogStorageKey = "trepca_catalog";
const matchesStorageKey = "trepca_matches";
const ticketTypesStorageKey = "trepca_ticket_types";
const adminEmail = "admin@trepca.com";
const adminPassword = "admin123";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const passwordMinLength = 8;

function readJsonStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(value) && value.length ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function enrichProduct(product) {
  if (isJersey(product)) {
    const jerseyVariants = getJerseyVariants(product);
    return { ...product, jerseyVariants, stock: jerseyTotalStock(jerseyVariants) };
  }
  const stock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 30;
  return { ...product, stock: Math.max(0, stock) };
}

function readCatalog() {
  return readJsonStorage(catalogStorageKey, defaultProducts).map(enrichProduct);
}

function formatDateLabel(dateIso) {
  if (!dateIso) return "";
  const parsed = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateIso;
  return parsed.toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" });
}

function getMatchDisplayDate(match) {
  if (match.dateIso) return formatDateLabel(match.dateIso);
  return match.date || "";
}

function sortMatchesByDate(matches) {
  return [...matches].sort((a, b) => {
    const aKey = `${a.dateIso || a.date || ""} ${a.time || ""}`;
    const bKey = `${b.dateIso || b.date || ""} ${b.time || ""}`;
    return aKey.localeCompare(bKey);
  });
}

function isProductOutOfStock(product) {
  return Number(product?.stock || 0) <= 0;
}

function formatDateTimeLabel(value) {
  const parsed = value ? new Date(value) : new Date();
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  return date.toLocaleString("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getLowStockProducts(catalog) {
  return catalog.filter((product) => product.stock < LOW_STOCK_THRESHOLD);
}

function getLowJerseyVariants(catalog) {
  const jersey = catalog.find(isJersey);
  if (!jersey) return [];
  return getJerseyVariants(jersey)
    .filter((variant) => variant.stock < JERSEY_LOW_STOCK_THRESHOLD)
    .map((variant) => ({
      ...variant,
      productName: jersey.name,
      message:
        variant.stock <= 0
          ? `Fanella numri ${variant.number} - ${variant.name} është jashtë stokut.`
          : `Fanella numri ${variant.number} - ${variant.name} ka vetëm ${variant.stock} copë.`
    }));
}

function getCartStockIssue(cartItems, catalog) {
  for (const item of cartItems) {
    if (item.itemType === "ticket") continue;
    const live = catalog.find((product) => product.id === item.product?.id) || item.product;
    if (!live) return "Produkti nuk u gjet në katalog.";

    if (isJersey(live)) {
      const variant = findJerseyVariant(live, item.jerseyPlayer);
      if (!variant || variant.stock <= 0) {
        return `${item.jerseyPlayer || live.name} nuk është në stok.`;
      }
      if (item.quantity > variant.stock) {
        return `${jerseyVariantLabel(variant)} nuk ka sasi të mjaftueshme në stok.`;
      }
      continue;
    }

    if (isProductOutOfStock(live)) {
      return `${live.name} nuk është në stok.`;
    }
    if (item.quantity > live.stock) {
      return `${live.name} nuk ka sasi të mjaftueshme në stok.`;
    }
  }
  return "";
}

function readMatches() {
  return sortMatchesByDate(readJsonStorage(matchesStorageKey, defaultMatches).map(enrichMatch));
}

function readTicketTypes() {
  return readJsonStorage(ticketTypesStorageKey, defaultTicketTypes);
}

function ensureAdminAccount() {
  const accounts = readStoredAccounts();
  let changed = false;
  const next = accounts.map((account) => {
    if (account.email === adminEmail) {
      if (account.role !== "admin" || account.password !== adminPassword) changed = true;
      return { ...account, role: "admin", password: adminPassword, name: account.name || "Administrator" };
    }
    if (!account.role) changed = true;
    return { ...account, role: "user" };
  });

  if (!next.some((account) => account.email === adminEmail)) {
    next.push({ name: "Administrator", email: adminEmail, password: adminPassword, role: "admin" });
    changed = true;
  }

  if (changed) localStorage.setItem(accountsStorageKey, JSON.stringify(next));
}

function readAllOrders() {
  const orders = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(accountDataPrefix)) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      const customerEmail = key.slice(accountDataPrefix.length);
      for (const order of data.orders || []) {
        orders.push({ ...order, customerEmail });
      }
    } catch {
      // skip invalid account blobs
    }
  }
  return orders.sort((a, b) =>
    String(b.purchasedAt || b.createdAt || "").localeCompare(String(a.purchasedAt || a.createdAt || ""))
  );
}

ensureAdminAccount();

function readStoredAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(accountsStorageKey) || "[]");
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function readAccountData(email) {
  try {
    const data = JSON.parse(localStorage.getItem(`${accountDataPrefix}${email}`) || "{}");
    return {
      cart: Array.isArray(data.cart) ? data.cart : [],
      orders: Array.isArray(data.orders) ? data.orders : [],
      notifications: Array.isArray(data.notifications) ? data.notifications : [],
      tickets: Array.isArray(data.tickets) ? data.tickets : [],
      scans: data.scans && typeof data.scans === "object" ? data.scans : {}
    };
  } catch {
    return { cart: [], orders: [], notifications: [], tickets: [], scans: {} };
  }
}

function writeAccountData(email, data) {
  localStorage.setItem(`${accountDataPrefix}${email}`, JSON.stringify(data));
}

export function App() {
  const [user, setUser] = useState(() => {
    ensureAdminAccount();
    try {
      const stored = JSON.parse(localStorage.getItem("trepca_user") || "null");
      if (!stored) return null;
      const account = readStoredAccounts().find((item) => item.email === stored.email);
      if (!account) return stored;
      const synced = {
        name: account.name,
        email: account.email,
        password: account.password,
        role: account.role || "user"
      };
      localStorage.setItem("trepca_user", JSON.stringify(synced));
      return synced;
    } catch {
      return null;
    }
  });
  const [catalog, setCatalog] = useState(readCatalog);
  const [matchList, setMatchList] = useState(readMatches);
  const [ticketTypeList, setTicketTypeList] = useState(readTicketTypes);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeView, setActiveView] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("trepca_user") || "null");
      return stored?.role === "admin" ? "admin-dashboard" : "home";
    } catch {
      return "home";
    }
  });
  const [cart, setCart] = useState(() => (user ? readAccountData(user.email).cart : []));
  const [orders, setOrders] = useState(() => (user ? readAccountData(user.email).orders : []));
  const [notifications, setNotifications] = useState(() => (user ? readAccountData(user.email).notifications : []));
  const [selectedProduct, setSelectedProduct] = useState(() => readCatalog()[0]);
  const [search, setSearch] = useState("");
  const [paymentModal, setPaymentModal] = useState(null);
  const [tickets, setTickets] = useState(() => (user ? readAccountData(user.email).tickets : []));
  const [scans, setScans] = useState(() => (user ? readAccountData(user.email).scans : {}));
  const [cartMessage, setCartMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState(null);
  const [publicTicket, setPublicTicket] = useState(() => readTicketFromUrl());

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + getCartItemTotal(item), 0), [cart]);
  const filteredProducts = useMemo(
    () => catalog.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())),
    [catalog, search]
  );

  const isAdmin = user?.role === "admin";

  function persistCatalog(nextCatalog) {
    const enriched = nextCatalog.map(enrichProduct);
    writeJsonStorage(catalogStorageKey, enriched);
    setCatalog(enriched);
  }

  function decrementCatalogStock(cartItems, baseCatalog = null) {
    setCatalog((current) => {
      const source = baseCatalog || current;
      const next = source.map((product) => {
        const related = cartItems.filter((item) => item.itemType !== "ticket" && item.product?.id === product.id);
        if (!related.length) return product;

        if (isJersey(product)) {
          const jerseyVariants = getJerseyVariants(product).map((variant) => {
            const sold = related
              .filter((item) => findJerseyVariant(product, item.jerseyPlayer)?.id === variant.id)
              .reduce((sum, item) => sum + item.quantity, 0);
            if (!sold) return variant;
            return { ...variant, stock: Math.max(0, variant.stock - sold) };
          });
          return enrichProduct({ ...product, jerseyVariants });
        }

        const sold = related.reduce((sum, item) => sum + item.quantity, 0);
        return enrichProduct({ ...product, stock: product.stock - sold });
      });
      writeJsonStorage(catalogStorageKey, next);
      return next;
    });
  }

  function persistMatches(nextMatches) {
    const enriched = sortMatchesByDate(nextMatches.map(enrichMatch));
    writeJsonStorage(matchesStorageKey, enriched);
    setMatchList(enriched);
  }

  function persistTicketTypes(nextTypes) {
    writeJsonStorage(ticketTypesStorageKey, nextTypes);
    setTicketTypeList(nextTypes);
  }

  useEffect(() => {
    if (!cartMessage) return undefined;
    const timer = setTimeout(() => setCartMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [cartMessage]);

  useEffect(() => {
    function syncPublicTicket() {
      setPublicTicket(readTicketFromUrl());
    }

    window.addEventListener("hashchange", syncPublicTicket);
    return () => window.removeEventListener("hashchange", syncPublicTicket);
  }, []);

  useEffect(() => {
    if (!user) return;
    writeAccountData(user.email, { cart, orders, notifications, tickets, scans });
  }, [user, cart, orders, notifications, tickets, scans]);

  useEffect(() => {
    function syncSharedCatalog(event) {
      if (event.key === catalogStorageKey) {
        const nextCatalog = readCatalog();
        setCatalog(nextCatalog);
        setSelectedProduct((current) => nextCatalog.find((product) => product.id === current?.id) || current);
      }
    }

    window.addEventListener("storage", syncSharedCatalog);
    return () => window.removeEventListener("storage", syncSharedCatalog);
  }, []);

  function submitAuth(event) {
    event.preventDefault();
    setAuthMessage("");
    setAuthError("");

    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;

    if (!emailPattern.test(email)) {
      setAuthError("Shkruaj një email valid, p.sh. emri@gmail.com ose emri@hotmail.com.");
      return;
    }

    if (password.length < passwordMinLength) {
      setAuthError("Passwordi duhet të ketë të paktën 8 karaktere.");
      return;
    }

    const accounts = readStoredAccounts();

    if (authMode === "register") {
      if (accounts.some((account) => account.email === email)) {
        setAuthError("Ekziston një llogari me këtë email.");
        return;
      }

      const nextAccount = {
        name: authForm.name.trim() || "Trepça Fan",
        email,
        password,
        role: "user"
      };

      localStorage.setItem(accountsStorageKey, JSON.stringify([...accounts, nextAccount]));
      setAuthMode("login");
      setAuthForm({ name: "", email, password: "" });
      setAuthMessage("Llogaria u krijua. Tani kyçu me emailin dhe passwordin që krijove.");
      return;
    }

    const account = accounts.find((item) => item.email === email && item.password === password);
    if (!account) {
      setAuthError("Emaili ose passwordi nuk është i saktë.");
      return;
    }

    const nextUser = {
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role || (account.email === adminEmail ? "admin" : "user")
    };

    localStorage.setItem("trepca_user", JSON.stringify(nextUser));
    const accountData = readAccountData(nextUser.email);
    setCart(accountData.cart);
    setOrders(accountData.orders);
    setNotifications(accountData.notifications);
    setTickets(accountData.tickets);
    setScans(accountData.scans);
    setUser(nextUser);
    setActiveView(nextUser.role === "admin" ? "admin-dashboard" : "home");
  }

  function logout() {
    localStorage.removeItem("trepca_user");
    setUser(null);
    setCart([]);
    setOrders([]);
    setNotifications([]);
    setTickets([]);
    setScans({});
    setActiveView("home");
  }

  function addToCart(product) {
    const liveCatalog = readCatalog();
    setCatalog(liveCatalog);
    const live = liveCatalog.find((item) => item.id === product.id) || product;
    const defaultVariant = isJersey(live) ? firstAvailableJerseyVariant(live) : null;

    if (isJersey(live) && !defaultVariant) {
      setCartMessage(`${live.name} nuk është në stok për asnjë numër.`);
      return false;
    }
    if (!isJersey(live) && isProductOutOfStock(live)) {
      setCartMessage(`${live.name} nuk është në stok.`);
      return false;
    }

    const existing = cart.find((item) => item.itemType !== "ticket" && item.product.id === live.id);
    const playerLabel = defaultVariant ? jerseyVariantLabel(defaultVariant) : "";

    if (existing) {
      const activeVariant =
        isJersey(live) && findJerseyVariant(live, existing.jerseyPlayer)
          ? findJerseyVariant(live, existing.jerseyPlayer)
          : defaultVariant;
      const limit = activeVariant ? activeVariant.stock : live.stock;
      if (existing.quantity >= limit) {
        setCartMessage(
          isJersey(live) && activeVariant
            ? `${jerseyVariantLabel(activeVariant)} nuk ka sasi të mjaftueshme në stok.`
            : `${live.name} nuk ka sasi të mjaftueshme në stok.`
        );
        return false;
      }
    }

    setCart((current) => {
      if (existing) {
        return current.map((item) =>
          item.itemType !== "ticket" && item.product.id === live.id
            ? { ...item, quantity: item.quantity + 1, product: live }
            : item
        );
      }
      return [
        {
          id: Date.now(),
          product: live,
          quantity: 1,
          size: isClothing(live) ? "M" : "",
          jerseyPlayer: playerLabel,
          jerseyColor: isJersey(live) ? jerseyColors[0] : ""
        },
        ...current
      ];
    });
    setCartMessage(`${live.name} u shtua në shportë.`);
    return true;
  }

  function addTicketToCart(ticket) {
    const cartTicket = {
      id: Date.now(),
      itemType: "ticket",
      quantity: ticket.quantity,
      unitPrice: ticket.price,
      ticket
    };
    setCart((current) => [cartTicket, ...current]);
    setCartMessage(`${ticket.match} u shtua në My Cart.`);
  }

  function updateCartItem(id, patch) {
    const liveCatalog = readCatalog();
    setCatalog(liveCatalog);
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const live = liveCatalog.find((product) => product.id === item.product?.id) || item.product;
        const quantity = patch.quantity == null ? item.quantity : Math.max(1, Number(patch.quantity));
        const jerseyPlayer = patch.jerseyPlayer == null ? item.jerseyPlayer : patch.jerseyPlayer;

        if (isJersey(live)) {
          const variant = findJerseyVariant(live, jerseyPlayer);
          if (!variant) {
            return { ...item, ...patch, quantity, jerseyPlayer, product: live };
          }
          if (variant.stock <= 0) {
            setCartMessage(`${jerseyVariantLabel(variant)} nuk është në stok.`);
            return { ...item, product: live };
          }
          if (quantity > variant.stock) {
            setCartMessage(`${jerseyVariantLabel(variant)} nuk ka sasi të mjaftueshme në stok.`);
            return { ...item, product: live };
          }
          return { ...item, ...patch, quantity, jerseyPlayer, product: live };
        }

        if (quantity > live.stock) {
          setCartMessage(`${live.name} nuk ka sasi të mjaftueshme në stok.`);
          return { ...item, product: live };
        }

        return { ...item, ...patch, quantity, product: live };
      })
    );
  }

  function removeCartItem(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function finishProductOrder(card, customer) {
    const liveCatalog = readCatalog();
    setCatalog(liveCatalog);
    const stockIssue = getCartStockIssue(cart, liveCatalog);
    if (stockIssue) {
      setCartMessage(stockIssue);
      setPaymentModal(null);
      setActiveView("cart");
      return;
    }

    const createdAt = new Date().toISOString();
    const order = {
      id: Date.now(),
      total: cartTotal,
      items: cart,
      cardName: card.fullName,
      customer,
      createdAt
    };
    const purchasedTickets = createPurchasedTickets(cart, order.id, customer);
    setOrders((current) => [order, ...current]);
    if (purchasedTickets.length > 0) {
      setTickets((current) => [...purchasedTickets, ...current]);
      setActiveTicket(purchasedTickets[0]);
    }
    setNotifications((current) => [
      { id: order.id, title: "Porosia juaj është kryer me sukses", text: `Porosia #${order.id} u krye me sukses.`, status: "completed", createdAt },
      ...(purchasedTickets.length > 0 ? [{ id: `${order.id}-tickets`, title: "Biletat u gjeneruan", text: `${purchasedTickets.length} ${purchasedTickets.length === 1 ? "biletë u gjenerua" : "bileta u gjeneruan"} me QR kod.`, status: "completed", createdAt }] : []),
      ...current
    ]);
    decrementCatalogStock(cart, liveCatalog);
    setCart([]);
    setPaymentModal(null);
    setActiveView(purchasedTickets.length > 0 ? "tickets" : "notifications");
  }

  function finishTicketPurchase(payload) {
    const purchasedAt = Date.now();
    const createdAt = new Date(purchasedAt).toISOString();
    const createdTickets = Array.from({ length: payload.quantity }, (_, index) => {
      const qr = `TRP-${purchasedAt}-${index + 1}`;
      const ticket = {
        id: `${purchasedAt}-${index + 1}`,
        qr,
        ...payload,
        ticketNumber: index + 1,
        quantity: 1,
        total: payload.total / payload.quantity
      };

      return {
        ...ticket,
        ticketUrl: createTicketUrl(ticket)
      };
    });
    setTickets((current) => [...createdTickets, ...current]);
    setActiveTicket(createdTickets[0]);
    setNotifications((current) => [
      {
        id: purchasedAt,
        title: "Bileta u ble me sukses",
        text: `${createdTickets.length} ${createdTickets.length === 1 ? "biletë u gjenerua" : "bileta u gjeneruan"} për ${payload.match}.`,
        status: "completed",
        createdAt
      },
      ...current
    ]);
  }

  function scanTicket(ticket) {
    const createdAt = new Date().toISOString();
    setScans((current) => ({ ...current, [ticket.id]: (current[ticket.id] || 0) + 1 }));
    setNotifications((current) => [
      {
        id: `${ticket.id}-scan-${Date.now()}`,
        title: "QR kodi u skenua",
        text: `${ticket.quantityLabel || ticket.match || ticket.name} u hap për kontroll.`,
        status: "completed",
        createdAt
      },
      ...current
    ]);
  }

  if (publicTicket) {
    return <PublicTicketPage ticket={publicTicket} />;
  }

  if (!user) {
    return (
      <main className="login-page">
        <section className="login-hero">
          <Brand />
          <div className="login-hero-copy">
            <p className="eyebrow">Trepça Fanshop</p>
            <h1>TREPÇA</h1>
            <h2>Basketball Club</h2>
            <p>Bli produkte zyrtare, bileta dhe përcjell njoftimet e porosive në një vend.</p>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <span>{authMode === "login" ? "Mirë se erdhe" : "Hape llogarinë"}</span>
            <h2>{authMode === "login" ? "Kyçu në fanshop" : "Regjistrohu si tifoz"}</h2>
          </div>
          <div className="auth-tabs">
            <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setAuthMessage(""); setAuthError(""); }}>Login</button>
            <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => { setAuthMode("register"); setAuthMessage(""); setAuthError(""); }}>Register</button>
          </div>
          <form onSubmit={submitAuth} className="product-form">
            {authMode === "register" && (
              <label>Emri<input value={authForm.name} onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))} required /></label>
            )}
            <label>Email<input type="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} required /></label>
            <label>Password<input type="password" minLength={passwordMinLength} value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} required /></label>
            {authError && <p className="field-error">{authError}</p>}
            {authMessage && <p className="auth-success">{authMessage}</p>}
            <button type="submit"><Lock size={17} /> {authMode === "login" ? "Login" : "Create account"}</button>
          </form>
        </section>
      </main>
    );
  }

  if (isAdmin) {
    return (
      <AdminPanel
        user={user}
        activeView={activeView}
        catalog={catalog}
        matchList={matchList}
        ticketTypeList={ticketTypeList}
        orders={readAllOrders()}
        onNavigate={setActiveView}
        onLogout={logout}
        onSaveCatalog={persistCatalog}
        onSaveMatches={persistMatches}
        onSaveTicketTypes={persistTicketTypes}
      />
    );
  }

  return (
    <main className="app-shell">
      <Sidebar user={user} activeView={activeView} onNavigate={setActiveView} onLogout={logout} />
      <section className="content-shell">
        <Topbar user={user} cart={cart} notifications={notifications} onNavigate={setActiveView} />
        {activeView === "home" && <HomeView onNavigate={setActiveView} />}
        {activeView === "about" && <AboutView catalog={catalog} />}
        {activeView === "shop" && (
          <ProductsView
            products={filteredProducts}
            search={search}
            cartMessage={cartMessage}
            onClearCartMessage={() => setCartMessage("")}
            onSearch={setSearch}
            onAddToCart={addToCart}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setActiveView("product");
            }}
          />
        )}
        {activeView === "product" && (
          <ProductDetail
            product={catalog.find((product) => product.id === selectedProduct?.id) || selectedProduct}
            cartMessage={cartMessage}
            onClearCartMessage={() => setCartMessage("")}
            onAddToCart={addToCart}
            onNavigate={setActiveView}
          />
        )}
        {activeView === "cart" && (
          <CartView
            cart={cart}
            catalog={catalog}
            total={cartTotal}
            cartMessage={cartMessage}
            onClearCartMessage={() => setCartMessage("")}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeCartItem}
            onBuyNow={() => {
              const liveCatalog = readCatalog();
              setCatalog(liveCatalog);
              const stockIssue = getCartStockIssue(cart, liveCatalog);
              if (stockIssue) {
                setCartMessage(stockIssue);
                return;
              }
              setPaymentModal({ type: "cart" });
            }}
          />
        )}
        {activeView === "tickets" && (
          <TicketsView
            tickets={tickets}
            scans={scans}
            matches={matchList}
            ticketTypes={ticketTypeList}
            onAddTicketToCart={addTicketToCart}
            onScanTicket={scanTicket}
            onShowTicket={(ticket) => {
              scanTicket(ticket);
              setActiveTicket(ticket);
            }}
          />
        )}
        {activeView === "notifications" && <NotificationsView notifications={notifications} orders={orders} />}
      </section>
      {paymentModal && <PaymentModal total={cartTotal} onClose={() => setPaymentModal(null)} onFinish={finishProductOrder} />}
      {activeTicket && <TicketQrModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />}
    </main>
  );
}

function JerseyVariantsEditor({ variants, onChange }) {
  const [draft, setDraft] = useState({ number: "", name: "", stock: "5" });
  const [addError, setAddError] = useState("");

  function updateVariant(id, field, value) {
    onChange(
      variants.map((variant) => {
        if (variant.id !== id) return variant;
        if (field === "stock") {
          return { ...variant, stock: Math.max(0, Number(value) || 0) };
        }
        return { ...variant, [field]: value };
      })
    );
  }

  function removeVariant(id) {
    onChange(variants.filter((variant) => variant.id !== id));
    setAddError("");
  }

  function addVariant() {
    const number = draft.number.trim();
    const name = draft.name.trim();
    if (!number || !name) {
      setAddError("Plotëso numrin dhe mbiemrin.");
      return;
    }

    if (variants.some((variant) => variant.number === number)) {
      setAddError(`Numri ${number} ekziston tashmë në listë.`);
      return;
    }

    const created = createJerseyVariant(number, name, draft.stock);
    onChange([created, ...variants]);
    setDraft({ number: "", name: "", stock: "5" });
    setAddError("");
  }

  return (
    <section className="jersey-variants-editor">
      <h3>Numrat & mbiemrat</h3>
      <p className="muted">
        Stoku për çdo lojtar. Totali: <strong>{jerseyTotalStock(variants)}</strong> copë
      </p>
      <ul className="jersey-variant-list">
        {variants.map((variant) => (
          <li className="jersey-variant-row" key={variant.id}>
            <label className="jersey-field">
              <span>Nr</span>
              <input
                value={variant.number}
                onChange={(event) => updateVariant(variant.id, "number", event.target.value)}
              />
            </label>
            <label className="jersey-field jersey-field--name">
              <span>Mbiemri</span>
              <input value={variant.name} onChange={(event) => updateVariant(variant.id, "name", event.target.value)} />
            </label>
            <label className="jersey-field jersey-field--stock">
              <span>Stoku</span>
              <input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(event) => updateVariant(variant.id, "stock", event.target.value)}
              />
            </label>
            <button
              type="button"
              className="danger-button btn-icon"
              title="Fshi lojtarin"
              aria-label={`Fshi ${jerseyVariantLabel(variant)}`}
              onClick={() => removeVariant(variant.id)}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      <div className="jersey-variant-add">
        <label className="jersey-field">
          <span>Nr</span>
          <input
            value={draft.number}
            onChange={(event) => {
              setAddError("");
              setDraft((current) => ({ ...current, number: event.target.value }));
            }}
          />
        </label>
        <label className="jersey-field jersey-field--name">
          <span>Mbiemri</span>
          <input
            value={draft.name}
            onChange={(event) => {
              setAddError("");
              setDraft((current) => ({ ...current, name: event.target.value }));
            }}
          />
        </label>
        <label className="jersey-field jersey-field--stock">
          <span>Stoku</span>
          <input
            type="number"
            min="0"
            value={draft.stock}
            onChange={(event) => setDraft((current) => ({ ...current, stock: event.target.value }))}
          />
        </label>
        <button type="button" className="ghost-button jersey-add-btn" onClick={addVariant}>
          <Plus size={16} /> Shto
        </button>
      </div>
      {addError && <p className="field-error jersey-add-error">{addError}</p>}
    </section>
  );
}

function AdminPanel({
  user,
  activeView,
  catalog,
  matchList,
  ticketTypeList,
  orders,
  onNavigate,
  onLogout,
  onSaveCatalog,
  onSaveMatches,
  onSaveTicketTypes
}) {
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    price: "",
    stock: "30",
    category: "Clothing",
    imageUrl: "/trepca-assets/dresa.png",
    jerseyVariants: []
  });
  const editingJersey = productForm.id === "jersey";
  const [matchForm, setMatchForm] = useState({
    opponentClubId: LEAGUE_CLUBS[0].id,
    trepcaSide: "home",
    dateIso: "",
    time: "19:00"
  });
  const [ticketForm, setTicketForm] = useState({ name: "", price: "" });
  const [deleteProduct, setDeleteProduct] = useState(null);

  const lowStockProducts = useMemo(() => getLowStockProducts(catalog), [catalog]);
  const lowJerseyVariants = useMemo(() => getLowJerseyVariants(catalog), [catalog]);
  const upcomingMatches = useMemo(() => sortMatchesByDate(matchList).slice(0, 4), [matchList]);
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const matchPreview = buildMatchFromAdminForm({
    opponentClubId: matchForm.opponentClubId,
    trepcaSide: matchForm.trepcaSide,
    dateIso: matchForm.dateIso,
    time: matchForm.time
  });

  const adminNav = [
    ["admin-dashboard", "Paneli kryesor", LayoutDashboard],
    ["admin-stock", "Stoku", Warehouse],
    ["admin-products", "Produktet", Package],
    ["admin-matches", "Ndeshjet", CalendarDays],
    ["admin-ticket-types", "Llojet e biletave", Ticket],
    ["admin-orders", "Porositë", ShoppingBag]
  ];

  function resetProductForm() {
    setProductForm({
      id: "",
      name: "",
      price: "",
      stock: "30",
      category: "Clothing",
      imageUrl: "/trepca-assets/dresa.png",
      jerseyVariants: []
    });
  }

  function saveProduct(event) {
    event.preventDefault();
    const base = {
      id: productForm.id || `p-${Date.now()}`,
      name: productForm.name.trim(),
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      category: productForm.category.trim() || "Clothing",
      imageUrl: productForm.imageUrl.trim() || "/trepca-assets/dresa.png"
    };

    if (isJersey(base)) {
      const jerseyVariants = normalizeJerseyVariantsForSave(productForm.jerseyVariants);
      base.jerseyVariants = jerseyVariants;
      base.stock = jerseyTotalStock(jerseyVariants);
    }

    const payload = enrichProduct(base);
    if (!payload.name || !Number.isFinite(payload.price)) return;
    if (isJersey(payload) && !payload.jerseyVariants.length) return;

    const exists = catalog.some((item) => item.id === payload.id);
    const next = exists
      ? catalog.map((item) => (item.id === payload.id ? payload : item))
      : [payload, ...catalog];
    onSaveCatalog(next);
    resetProductForm();
  }

  function editProduct(product) {
    setProductForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      imageUrl: product.imageUrl,
      jerseyVariants: isJersey(product) ? getJerseyVariants(product) : []
    });
  }

  function confirmDeleteProduct() {
    if (!deleteProduct) return;
    onSaveCatalog(catalog.filter((item) => item.id !== deleteProduct.id));
    setDeleteProduct(null);
  }

  function addMatch(event) {
    event.preventDefault();
    if (!matchForm.dateIso) return;
    const created = buildMatchFromAdminForm(matchForm);
    if (!created) return;
    onSaveMatches(sortMatchesByDate([...matchList, created]));
    setMatchForm({
      opponentClubId: matchForm.opponentClubId,
      trepcaSide: matchForm.trepcaSide,
      dateIso: "",
      time: matchForm.time || "19:00"
    });
  }

  function removeMatch(id) {
    onSaveMatches(matchList.filter((match) => match.id !== id));
  }

  function addTicketType(event) {
    event.preventDefault();
    if (!ticketForm.name.trim() || !ticketForm.price) return;
    onSaveTicketTypes([
      { id: `t-${Date.now()}`, name: ticketForm.name.trim(), price: Number(ticketForm.price) },
      ...ticketTypeList
    ]);
    setTicketForm({ name: "", price: "" });
  }

  function removeTicketType(id) {
    onSaveTicketTypes(ticketTypeList.filter((type) => type.id !== id));
  }

  return (
    <main className="app-shell admin-shell">
      <aside className="sidebar admin-sidebar">
        <Brand />
        <div className="profile-card admin-profile">
          <span className="avatar admin-avatar">A</span>
          <div>
            <small className="admin-role-pill">Administrator</small>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <nav>
          {adminNav.map(([key, label, Icon]) => (
            <button key={key} className={activeView === key ? "active" : ""} onClick={() => onNavigate(key)}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <button className="logout-link" onClick={onLogout}>
          <LogOut size={18} /> Dil
        </button>
      </aside>

      <section className="content-shell admin-content">
        <header className="admin-page-header">
          <div>
            <p className="eyebrow">Paneli i stafit</p>
            <h1>Menaxhimi i fanshop-it</h1>
            <p>Stoku, ndeshjet, produktet dhe porositë e tifozëve.</p>
          </div>
        </header>

        {activeView === "admin-products" && (
          <div className="page-stack admin-page">
            <section className="admin-grid">
              <article className="admin-card">
                <h2>{productForm.id && catalog.some((p) => p.id === productForm.id) ? "Ndrysho produktin" : "Shto produkt"}</h2>
                <form className="admin-form" onSubmit={saveProduct}>
                  <label>Emri<input value={productForm.name} onChange={(e) => setProductForm((c) => ({ ...c, name: e.target.value }))} required /></label>
                  <label>Çmimi (€)<input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm((c) => ({ ...c, price: e.target.value }))} required /></label>
                  {!editingJersey && (
                    <label>
                      Stoku
                      <input
                        type="number"
                        min="0"
                        value={productForm.stock}
                        onChange={(e) => setProductForm((c) => ({ ...c, stock: e.target.value }))}
                        required
                      />
                    </label>
                  )}
                  <label>Kategoria<input value={productForm.category} onChange={(e) => setProductForm((c) => ({ ...c, category: e.target.value }))} placeholder="Clothing, Accessories…" required /></label>
                  <label>URL foto<input value={productForm.imageUrl} onChange={(e) => setProductForm((c) => ({ ...c, imageUrl: e.target.value }))} /></label>
                  {editingJersey && (
                    <JerseyVariantsEditor
                      variants={productForm.jerseyVariants}
                      onChange={(jerseyVariants) => setProductForm((current) => ({ ...current, jerseyVariants }))}
                    />
                  )}
                  <div className="admin-form-actions">
                    <button type="submit">{productForm.id && catalog.some((p) => p.id === productForm.id) ? "Ruaj" : "Shto"}</button>
                    {productForm.id && <button type="button" className="ghost-button" onClick={resetProductForm}>Anulo</button>}
                  </div>
                </form>
              </article>

              <article className="admin-card admin-list-card">
                <h2>Katalogu ({catalog.length})</h2>
                <div className="admin-list">
                  {catalog.map((product) => (
                    <div className="admin-list-row" key={product.id}>
                      <img src={product.imageUrl} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        <span>
                          {product.category} · {formatCurrency(product.price)} ·{" "}
                          <span className={product.stock < LOW_STOCK_THRESHOLD ? "stock-low" : "stock-ok"}>
                            {product.stock} në stok
                          </span>
                        </span>
                      </div>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="ghost-button btn-icon"
                          title="Ndrysho"
                          aria-label={`Ndrysho ${product.name}`}
                          onClick={() => editProduct(product)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          className="danger-button btn-icon"
                          title="Fshi"
                          aria-label={`Fshi ${product.name}`}
                          onClick={() => setDeleteProduct(product)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        )}

        {activeView === "admin-dashboard" && (
          <section className="admin-page admin-dashboard-v2">
            {lowJerseyVariants.length > 0 && (
              <div className="admin-stock-alert" role="alert">
                <AlertTriangle size={22} />
                <div>
                  <strong>Fanellat që duhen furnizuar</strong>
                  <ul className="admin-alert-list">
                    {lowJerseyVariants.map((variant) => (
                      <li key={variant.id}>{variant.message}</li>
                    ))}
                  </ul>
                </div>
                <button type="button" className="ghost-button" onClick={() => onNavigate("admin-stock")}>
                  Shiko stokun
                </button>
              </div>
            )}
            <div className="admin-dash-grid">
              <article className="admin-card admin-dash-panel">
                <h2><CalendarDays size={20} /> Ndeshjet e ardhshme</h2>
                {upcomingMatches.length === 0 ? (
                  <p className="muted">Nuk ka ndeshje të planifikuara.</p>
                ) : (
                  <ul className="admin-dash-list">
                    {upcomingMatches.map((match) => {
                      const arena = getMatchArena(match);
                      return (
                        <li key={match.id} className="admin-dash-match">
                          <img src={arena.imageUrl} alt="" />
                          <div>
                            <strong>{match.home} vs {match.away}</strong>
                            <span>{getMatchDisplayDate(match)} · {match.time}</span>
                            <small>{arena.name}</small>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <button type="button" className="ghost-button" onClick={() => onNavigate("admin-matches")}>
                  Menaxho ndeshjet
                </button>
              </article>

              <article className="admin-card admin-dash-panel">
                <h2><ShoppingBag size={20} /> Porositë e fundit</h2>
                {recentOrders.length === 0 ? (
                  <p className="muted">Ende pa porosi nga tifozët.</p>
                ) : (
                  <ul className="admin-dash-list">
                    {recentOrders.map((order) => (
                      <li key={`${order.customerEmail}-${order.id}`}>
                        <strong>{order.customerEmail}</strong>
                        <span>
                          {formatCurrency(order.total || 0)} ·{" "}
                          {order.purchasedAt || order.createdAt
                            ? new Date(order.purchasedAt || order.createdAt).toLocaleString("sq-AL")
                            : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" className="ghost-button" onClick={() => onNavigate("admin-orders")}>
                  Të gjitha porositë
                </button>
              </article>

              <article className="admin-card admin-dash-panel admin-dash-stock-panel">
                <h2><Warehouse size={20} /> Stoku</h2>
                {lowJerseyVariants.length === 0 ? (
                  <p className="muted">Fanellat janë në nivel të mirë furnizimi.</p>
                ) : (
                  <>
                    <p className="admin-dash-warning">
                      <AlertTriangle size={18} /> Kontrollo fanellat:
                    </p>
                    <ul className="admin-dash-list">
                      {lowJerseyVariants.map((variant) => (
                        <li key={variant.id} className="stock-row-low">
                          <span>#{variant.number} - {variant.name}</span>
                          <strong>{variant.stock <= 0 ? "Jashtë stokut" : `${variant.stock} copë`}</strong>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <button type="button" onClick={() => onNavigate("admin-stock")}>
                  Hap inventarin
                </button>
              </article>

              <article className="admin-card admin-dash-panel admin-dash-actions">
                <h2>Veprime të shpejta</h2>
                <div className="admin-quick-actions">
                  <button type="button" onClick={() => onNavigate("admin-matches")}>+ Ndeshje e re</button>
                  <button type="button" className="ghost-button" onClick={() => onNavigate("admin-products")}>
                    + Produkt
                  </button>
                  <button type="button" className="ghost-button" onClick={() => onNavigate("admin-ticket-types")}>
                    Llojet e biletave
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeView === "admin-stock" && (
          <section className="admin-page">
            <article className="admin-card">
              <h2>Inventari i produkteve</h2>
              <p className="muted">
                Produktet me më pak se {LOW_STOCK_THRESHOLD} copë shënohen me të kuqe — porosit nga furnitori.
              </p>
              <div className="admin-stock-table">
                {catalog.map((product) => (
                  <div
                    key={product.id}
                    className={`admin-stock-row ${product.stock < LOW_STOCK_THRESHOLD ? "is-low" : ""}`}
                  >
                    <img src={product.imageUrl} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.category}</span>
                    </div>
                    <div className="admin-stock-qty">
                      <span className={product.stock < LOW_STOCK_THRESHOLD ? "stock-low" : "stock-ok"}>
                        {product.stock}
                      </span>
                      <small>copë</small>
                      {product.stock < LOW_STOCK_THRESHOLD && <em className="stock-warning-label">Porosit tani</em>}
                    </div>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        onNavigate("admin-products");
                        editProduct(product);
                      }}
                    >
                      Ndrysho
                    </button>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeView === "admin-matches" && (
          <div className="page-stack admin-page">
            <section className="admin-grid admin-grid--matches">
              <article className="admin-card">
                <h2>Shto ndeshje</h2>
                <form className="admin-form" onSubmit={addMatch}>
                  <label>
                    Kundërshtari
                    <select
                      value={matchForm.opponentClubId}
                      onChange={(e) => setMatchForm((c) => ({ ...c, opponentClubId: e.target.value }))}
                      required
                    >
                      {LEAGUE_CLUBS.map((club) => (
                        <option key={club.id} value={club.id}>
                          {clubSelectLabel(club)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <fieldset className="trepca-side-fieldset">
                    <legend>Trepça në këtë ndeshje</legend>
                    <label className="radio-pill">
                      <input
                        type="radio"
                        name="trepcaSide"
                        value="home"
                        checked={matchForm.trepcaSide === "home"}
                        onChange={() => setMatchForm((c) => ({ ...c, trepcaSide: "home" }))}
                      />
                      Vendas (Minatori)
                    </label>
                    <label className="radio-pill">
                      <input
                        type="radio"
                        name="trepcaSide"
                        value="away"
                        checked={matchForm.trepcaSide === "away"}
                        onChange={() => setMatchForm((c) => ({ ...c, trepcaSide: "away" }))}
                      />
                      Mysafir (palestra e kundërshtarit)
                    </label>
                  </fieldset>
                  <label>
                    Data e ndeshjes
                    <input
                      type="date"
                      value={matchForm.dateIso}
                      onChange={(e) => setMatchForm((c) => ({ ...c, dateIso: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Ora e fillimit
                    <select
                      value={matchForm.time}
                      onChange={(e) => setMatchForm((c) => ({ ...c, time: e.target.value }))}
                      required
                    >
                      {MATCH_TIME_OPTIONS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </label>
                  {matchPreview && (
                    <div className="match-preview-card">
                      <img src={matchPreview.arenaImageUrl} alt={matchPreview.arenaName} />
                      <div>
                        <strong>{matchPreview.home} vs {matchPreview.away}</strong>
                        <span>{matchPreview.arenaName}</span>
                        <small>{matchForm.trepcaSide === "home" ? "Trepça vendas" : "Trepça mysafir"}</small>
                      </div>
                    </div>
                  )}
                  <div className="admin-form-actions">
                    <button type="submit">Shto ndeshjen</button>
                  </div>
                </form>
              </article>
              <article className="admin-card admin-list-card">
                <h2>Kalendari ({matchList.length})</h2>
                <div className="admin-match-grid">
                  {matchList.map((match) => {
                    const arena = getMatchArena(match);
                    return (
                      <article className="admin-match-card" key={match.id}>
                        <img src={arena.imageUrl} alt={arena.name} />
                        <div>
                          <strong>{match.home} vs {match.away}</strong>
                          <span>{getMatchDisplayDate(match)} · {match.time}</span>
                          <span>{arena.name}</span>
                          <small>{match.trepcaSide === "away" ? "Mysafir" : "Vendas"}</small>
                        </div>
                        <button
                          type="button"
                          className="danger-button btn-icon"
                          title="Fshi ndeshjen"
                          aria-label={`Fshi ${match.home} vs ${match.away}`}
                          onClick={() => removeMatch(match.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              </article>
            </section>
          </div>
        )}

        {activeView === "admin-ticket-types" && (
          <section className="admin-page">
            <article className="admin-card">
              <h2>Llojet e biletave</h2>
                <form className="admin-form admin-form--inline-submit" onSubmit={addTicketType}>
                  <label>Emri<input value={ticketForm.name} onChange={(e) => setTicketForm((c) => ({ ...c, name: e.target.value }))} required /></label>
                  <label>Çmimi<input type="number" min="0" value={ticketForm.price} onChange={(e) => setTicketForm((c) => ({ ...c, price: e.target.value }))} required /></label>
                  <div className="admin-form-actions">
                    <button type="submit">Shto</button>
                  </div>
                </form>
                <div className="admin-list compact">
                  {ticketTypeList.map((type) => (
                    <div className="admin-list-row admin-list-row--simple" key={type.id}>
                      <div>
                        <strong>{type.name}</strong>
                        <span>{formatCurrency(type.price)}</span>
                      </div>
                      <button
                        type="button"
                        className="danger-button btn-icon"
                        title="Fshi"
                        aria-label={`Fshi ${type.name}`}
                        onClick={() => removeTicketType(type.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
            </article>
          </section>
        )}

        {activeView === "admin-orders" && (
          <section className="admin-card admin-page">
            <h2>Porositë e tifozëve ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="muted">Ende nuk ka porosi të ruajtura.</p>
            ) : (
              <div className="admin-list">
                {orders.map((order) => (
                  <article className="admin-order-row" key={`${order.customerEmail}-${order.id}`}>
                    <div>
                      <strong>{order.customerEmail}</strong>
                      <span>
                        {order.purchasedAt || order.createdAt
                          ? formatDateTimeLabel(order.purchasedAt || order.createdAt)
                          : "—"}
                      </span>
                    </div>
                    <p>{order.items?.map((item) => item.name || item.product?.name).filter(Boolean).join(", ") || "Porosi"}</p>
                    <strong>{formatCurrency(order.total || 0)}</strong>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>

      {deleteProduct && (
        <div className="modal-overlay">
          <div className="modal-card admin-modal">
            <h2>Fshi «{deleteProduct.name}»?</h2>
            <p>Produkti hiqet nga dyqani për të gjithë tifozët.</p>
            <div className="admin-form-actions">
              <button type="button" className="ghost-button" onClick={() => setDeleteProduct(null)}>Anulo</button>
              <button type="button" className="danger-button" onClick={confirmDeleteProduct}>Fshi</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">T</span>
      <strong>TREPÇA</strong>
    </div>
  );
}

function Sidebar({ user, activeView, onNavigate, onLogout }) {
  const items = [
    ["home", "Home", Home],
    ["about", "About Us", Users],
    ["shop", "Products", ShoppingBag],
    ["cart", "My Cart", ShoppingBag],
    ["tickets", "Tickets", Ticket],
    ["notifications", "Notifications", Bell]
  ];

  return (
    <aside className="sidebar">
      <Brand />
      <div className="profile-card">
        <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <small>Mirë se erdhe</small>
          <strong>{user.name}</strong>
        </div>
      </div>
      <nav>
        {items.map(([key, label, Icon]) => (
          <button key={key} className={activeView === key ? "active" : ""} onClick={() => onNavigate(key)}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>
      <button className="logout-link" onClick={onLogout}><LogOut size={18} /> Logout</button>
    </aside>
  );
}

function Topbar({ user, cart, notifications, onNavigate }) {
  const [clock, setClock] = useState(() => new Date());
  const [openPanel, setOpenPanel] = useState(null);
  const readNotificationsKey = `trepca_read_notifications_${user.email}`;
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(readNotificationsKey) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const unreadNotifications = notifications.filter((notification) => !readNotificationIds.includes(notification.id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (openPanel === "notifications") {
      markNotificationsRead();
    }
  }, [openPanel, notifications]);

  function markNotificationsRead() {
    const readIds = notifications.map((notification) => notification.id);
    setReadNotificationIds(readIds);
    localStorage.setItem(readNotificationsKey, JSON.stringify(readIds));
  }

  function openNotifications() {
    setOpenPanel((current) => (current === "notifications" ? null : "notifications"));
    markNotificationsRead();
  }

  return (
    <header className="topbar">
      <div>
        <span>Mirë se erdhe, {user.name}</span>
        <strong>Trepça Fanshop</strong>
      </div>
      <div className="topbar-actions" aria-label="Quick actions">
        <div className="topbar-clock"><Clock size={15} /><span>{clock.toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" })}</span></div>
        <div className="quick-action-wrap">
          <button className="icon-button" title="Notifications" onClick={openNotifications}>
            <Bell size={18} />
            {unreadNotifications.length > 0 && <span className="cart-dot">{unreadNotifications.length}</span>}
          </button>
          {openPanel === "notifications" && (
            <div className="quick-popover">
              <h3>Notifications</h3>
              {notifications.length === 0 ? <p>Nuk ka njoftime të reja.</p> : notifications.slice(0, 4).map((notification) => (
                <article key={notification.id}>
                  <strong>{notification.title}</strong>
                  <span>{notification.text}</span>
                  <time>{formatDateTimeLabel(notification.createdAt)}</time>
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="quick-action-wrap">
          <button className="icon-button" title="My Cart" onClick={() => setOpenPanel((current) => (current === "cart" ? null : "cart"))}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
          </button>
          {openPanel === "cart" && (
            <div className="quick-popover cart-preview">
              <h3>My Cart</h3>
              {cart.length === 0 ? <p>Shporta është e zbrazët.</p> : cart.slice(0, 4).map((item) => (
                <article key={item.id} className="mini-cart-item">
                  {item.itemType === "ticket" ? <span className="mini-ticket-icon"><Ticket size={16} /></span> : <img src={item.product.imageUrl} alt={item.product.name} />}
                  <span>{item.quantity}x {getCartItemName(item)}</span>
                </article>
              ))}
              <button type="button" onClick={() => { setOpenPanel(null); onNavigate("cart"); }}>Hape My Cart</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HomeView({ onNavigate }) {
  return (
    <div className="page-stack">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Trepça Basketball Club</p>
          <h1>TREPÇA</h1>
          <h2>Basketboll, bileta dhe fanshop</h2>
          <p>Fanshop-i i Trepçës është vendi ku tifozët gjejnë veshje, aksesorë dhe produkte të përditshme me identitetin e klubit. Çdo produkt është menduar për ditë ndeshjeje, për qytet dhe për ata që duan ta mbajnë Trepçën afër edhe jashtë palestrës.</p>
          <div className="hero-actions">
            <button onClick={() => onNavigate("shop")}>Shiko Produktet</button>
            <button className="ghost-button" onClick={() => onNavigate("tickets")}>Biletat</button>
          </div>
        </div>
        <div className="hero-player">
          <img src={homeImages[0]} alt="Trepça Fanshop" />
        </div>
      </section>

      <section className="home-stats">
        {[["1947", "Fillimi i klubit"], ["3", "Kampionate kombëtare"], ["4", "Kupa të Kosovës"], ["3000", "Kapaciteti i Sallës Minatori"]].map(([value, label]) => (
          <article className="stat-card" key={label}><strong>{value}</strong><span>{label}</span></article>
        ))}
      </section>

      <section className="home-gallery">
        <img src={homeImages[0]} alt="Trepça Fanshop" />
        <div>
          <p className="eyebrow">Trepça na bashkon</p>
          <h2>Fanshop për veshje, aksesorë dhe produkte që e mbajnë klubin në përditshmëri.</h2>
          <p>Në home mund të nisesh menjëherë te produktet, të shohësh biletat ose të vazhdosh blerjen pa u ndërprerë. Shporta, njoftimet dhe checkout-i janë bërë të thjeshtë që porosia të kryhet pa hapa të panevojshëm.</p>
          <p>Produktet janë ndarë për përdorim real: fanella e shorts për lojë e stërvitje, duks e maicë për çdo ditë, shall e kapelë për tribunë, çantë për palestër dhe shishe për lëvizje.</p>
        </div>
      </section>
    </div>
  );
}
function AboutView({ catalog }) {
  const clubFacts = [
    ["Identiteti", "Trepça lidhet fort me Mitrovicën dhe me kulturën sportive të qytetit."],
    ["Ngjyrat", "E gjelbra dhe e zeza janë pjesë e pamjes së klubit dhe shfaqen në produktet e fanshop-it."],
    ["Publiku", "Ndeshjet në Minatori njihen për atmosferë të zëshme dhe përkrahje të vazhdueshme."],
    ["Akademia", "Klubi mbështet zhvillimin e lojtarëve të rinj dhe lidhjen e tyre me ekipin e parë."],
    ["Derbit", "Përballjet me rivalët kosovarë zakonisht sjellin interes të madh nga tifozët."],
    ["Komuniteti", "Fanshop-i ndihmon tifozët ta mbajnë klubin pranë edhe jashtë ditës së ndeshjes."],
    ["Përzgjedhja", "Çdo kategori ka rol të qartë: veshje, aksesorë, pajisje dhe produkte për rutinën e tifozit."],
    ["Stili", "Produktet janë menduar për palestër, për qytet dhe për përdorim të përditshëm."],
    ["Porositë", "Çdo blerje ruhet te njoftimet që përdoruesi ta ketë më lehtë ta ndjekë historikun."],
    ["Eksperienca", "Faqja është menduar që tifozët të vazhdojnë shfletimin edhe pasi shtojnë një produkt në shportë."]
  ];

  return (
    <div className="page-stack">
      <section className="about-grid">
        <article className="about-panel">
          <p className="eyebrow">Rreth nesh</p>
          <h2>KB Trepça është klub profesionist nga Mitrovica me traditë të gjatë në basketboll.</h2>
          <p>Klubi garon në basketbollin kosovar dhe njihet për publikun e zjarrtë në Sallën e Sporteve Minatori. Fanshop-i është përballë Palestrës Minatori në Mitrovicë, aty ku dita e ndeshjes fillon para se të hapen dyert e palestrës.</p>
          <p>Dyqani është menduar si pikë takimi për tifozët: mund të marrësh dresë para lojës, shall për tribunë, kapelë për përditshmëri, çantë për stërvitje ose shishe për rrugë. Produktet nuk janë vetëm suvenire, por pjesë e mënyrës si tifozët e mbajnë klubin me vete.</p>
          <p>Online fanshop-i e bën blerjen më të qetë. E shton produktin në shportë pa u larguar nga lista, zgjedh madhësi ose detaje të dresës, kontrollon shpejt çka ke në cart dhe pastaj vazhdon me të dhënat e porosisë vetëm kur je gati.</p>
          <p>Qëllimi është që përvoja të ndihet si dyqani fizik: e sheh produktin qartë, zgjedh variantin që të pëlqen, merr njoftim pas porosisë dhe e ke gjithçka të ruajtur në një vend.</p>
        </article>
        <article className="about-panel facts-panel">
          <h2>Fakte të përgjithshme</h2>
          <div className="fact-list">
            <span><strong>Fillimi</strong>KB Trepça u themelua në vitin 1947.</span>
            <span><strong>Vendi</strong>Mitrovicë, Kosovë.</span>
            <span><strong>Palestra</strong>Salla e Sporteve Minatori.</span>
            <span><strong>Lojtarë</strong>Ekip profesionist me lojtarë vendorë dhe ndërkombëtarë.</span>
            <span><strong>Suksese</strong>3 kampionate kombëtare dhe 4 Kupa të Kosovës.</span>
            <span><strong>Rivalitet</strong>Ndeshjet kryesore mbledhin interes të madh në ligë.</span>
            <span><strong>Tifozëria</strong>Mbështetja në tribuna është pjesë e identitetit të klubit.</span>
          </div>
        </article>
      </section>

      <section className="about-showcase">
        {aboutImages.map((image, index) => (
          <img key={image} src={image} alt={`Trepça Fanshop pamje ${index + 1}`} />
        ))}
      </section>

      <section className="about-products">
        <SectionHeader title="Më shumë rreth klubit" />
        <div className="club-fact-grid">
          {clubFacts.map(([title, text]) => <article key={title}><strong>{title}</strong><span>{text}</span></article>)}
        </div>
      </section>

      <section className="about-products">
        <SectionHeader title="Produktet që i shesim" />
        <div className="about-product-list">{catalog.map((product) => <span key={product.id}>{product.name}</span>)}</div>
      </section>

      <section className="services-grid">
        {[
          ["Bileta për ndeshje", "Rezervim i biletave për lojërat kryesore dhe ruajtje e blerjeve në llogari."],
          ["Produkte zyrtare", "Fanella, shorts, duks, maicë, shalla, çanta, kapela dhe bottle."],
          ["Porosi online", "Zgjedh produktin, plotëson të dhënat dhe pranon njoftim kur porosia kryhet."],
          ["Rrjedhë e lehtë", "My Cart, checkout, njoftime dhe historiku i blerjeve janë në një vend."]
        ].map(([title, text]) => <article className="service-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section className="social-panel">
        <h2>Rrjetet sociale</h2>
        <div className="social-list"><p>Instagram: <strong>@trepcafanshop</strong></p><p>Facebook: <strong>@trepcafanshop</strong></p><p>TikTok: <strong>@trepcafanshop</strong></p></div>
      </section>
    </div>
  );
}

function ProductsView({ products, search, cartMessage, onClearCartMessage, onSearch, onSelectProduct, onAddToCart }) {
  return (
    <section className="products-page">
      <div className="products-toolbar">
        <SectionHeader title="Products" />
        <label className="search-field">
          <span><Search size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} /></span>
        </label>
      </div>
      {cartMessage && <CartNotice message={cartMessage} onClose={onClearCartMessage} />}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={() => onSelectProduct(product)} onAdd={() => onAddToCart(product)} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, onSelect, onAdd }) {
  const outOfStock = isProductOutOfStock(product);

  return (
    <article className={`product-card ${outOfStock ? "is-out-of-stock" : ""}`}>
      <button className="image-button" onClick={onSelect}><img src={product.imageUrl} alt={product.name} /></button>
      <div>
        <span>{product.category}</span>
        <h3>{product.name}</h3>
        {outOfStock && <p>Nuk ka në stok</p>}
        <div className="product-footer">
          <strong>{formatCurrency(product.price)}</strong>
          <button title={outOfStock ? "Nuk ka në stok" : "Add to cart"} onClick={onAdd} disabled={outOfStock}><Plus size={17} /></button>
        </div>
      </div>
    </article>
  );
}

function ProductDetail({ product, cartMessage, onClearCartMessage, onAddToCart, onNavigate }) {
  const outOfStock = isProductOutOfStock(product);

  return (
    <section className="detail-layout">
      <div className="product-photo"><img src={product.imageUrl} alt={product.name} /></div>
      <div className="product-detail">
        {cartMessage && <CartNotice message={cartMessage} onClose={onClearCartMessage} />}
        <p className="breadcrumb">Home / Products / {product.category}</p>
        <h1>{product.name}</h1>
        <strong className="price">{formatCurrency(product.price)}</strong>
        <p>{outOfStock ? "Nuk ka në stok." : isClothing(product) ? "Produkt zyrtar i KB Trepça. Madhësia zgjedhet në My Cart para pagesës." : "Aksesor zyrtar i KB Trepça për ditë ndeshjeje dhe përkrahje të klubit."}</p>
        <button onClick={() => onAddToCart(product)} disabled={outOfStock}><ShoppingBag size={18} /> Add to Cart</button>
        <button
          className="ghost-button"
          disabled={outOfStock}
          onClick={() => {
            if (onAddToCart(product)) onNavigate("cart");
          }}
        >
          Buy Now
        </button>
      </div>
    </section>
  );
}

function CartNotice({ message, onClose }) {
  return (
    <div className="cart-notice">
      <span>{message}</span>
      
    </div>
  );
}

function CartView({ cart, catalog, total, cartMessage, onClearCartMessage, onUpdateItem, onRemoveItem, onBuyNow }) {
  return (
    <section className="cart-page">
      <div className="cart-workspace">
        <SectionHeader title="My Cart" />
        {cartMessage && <CartNotice message={cartMessage} onClose={onClearCartMessage} />}
        {cart.length === 0 ? <div className="empty-state">Shporta juaj është e zbrazët.</div> : (
          <div className="cart-page-list">
            {cart.map((item) => {
              const liveProduct =
                item.itemType === "ticket" ? null : catalog.find((product) => product.id === item.product?.id) || item.product;
              const jerseyVariants = liveProduct && isJersey(liveProduct) ? getJerseyVariants(liveProduct) : [];

              return (
              <article className="cart-page-item" key={item.id}>
                {item.itemType === "ticket" ? <div className="cart-ticket-icon"><Ticket size={28} /></div> : <img src={item.product.imageUrl} alt={item.product.name} />}
                <div>
                  <span>{getCartItemCategory(item)}</span>
                  <h3>{getCartItemName(item)}</h3>
                  {item.itemType === "ticket" && <p>{item.ticket.date} - {item.ticket.time} · {item.ticket.arena}</p>}
                  <strong>{formatCurrency(getCartItemPrice(item))}</strong>
                </div>
                <div className="cart-controls">
                  <div className="quantity-controls">
                    <button onClick={() => onUpdateItem(item.id, { quantity: item.quantity - 1 })}><Minus size={15} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}><Plus size={15} /></button>
                    <button onClick={() => onRemoveItem(item.id)}><Trash2 size={15} /></button>
                  </div>
                  {item.itemType !== "ticket" && isClothing(liveProduct || item.product) && (
                    <>
                      <label>Madhësia<select value={item.size} onChange={(event) => onUpdateItem(item.id, { size: event.target.value })}>{sizes.map((size) => <option key={size}>{size}</option>)}</select></label>
                      {isJersey(liveProduct || item.product) && (
                        <div className="jersey-options">
                          <label>
                            Numri / mbiemri
                            <select
                              value={item.jerseyPlayer}
                              onChange={(event) => onUpdateItem(item.id, { jerseyPlayer: event.target.value })}
                            >
                              {jerseyVariants.map((variant) => (
                                <option
                                  key={variant.id}
                                  value={jerseyVariantLabel(variant)}
                                  disabled={variant.stock <= 0}
                                >
                                  {jerseyVariantLabel(variant)}
                                  {variant.stock <= 0 ? " (pa stok)" : ""}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>Ngjyra<select value={item.jerseyColor} onChange={(event) => onUpdateItem(item.id, { jerseyColor: event.target.value })}>{jerseyColors.map((color) => <option key={color}>{color}</option>)}</select></label>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        )}
      </div>
      <aside className="checkout-panel">
        <h2>Trepça Basket</h2>
        <div className="cart-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        <button disabled={!cart.length} onClick={onBuyNow}><CreditCard size={18} /> Buy Now</button>
      </aside>
    </section>
  );
}

function TicketsView({ tickets, scans, matches, ticketTypes, onAddTicketToCart, onScanTicket, onShowTicket }) {
  const [activeType, setActiveType] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [ticketMessage, setTicketMessage] = useState("");

  function toggleType(type) {
    setActiveType((current) => {
      const nextType = current?.id === type.id ? null : type;
      if (nextType?.id !== "single") setSelectedMatch(null);
      setQuantity(1);
      return nextType;
    });
  }

  function selectMatch(match) {
    setSelectedMatch((current) => (current?.id === match.id ? null : match));
    setQuantity(1);
  }

  function addSelectedTicket() {
    if (!activeType) return;
    const arena = selectedMatch ? getMatchArena(selectedMatch).name : "Minatori";
    const matchTitle = selectedMatch ? `${selectedMatch.home} vs ${selectedMatch.away}` : activeType.name;

    onAddTicketToCart({
      typeId: activeType.id,
      name: activeType.name,
      match: matchTitle,
      quantityLabel: selectedMatch ? `${matchTitle} - ${selectedMatch.date}, ${selectedMatch.time}` : activeType.name,
      date: selectedMatch ? getMatchDisplayDate(selectedMatch) : "Sezoni 2026",
      time: selectedMatch ? selectedMatch.time : "E vlefshme gjatë periudhës së paketës",
      arena,
      quantity,
      price: activeType.price
    });
    setTicketMessage(`${matchTitle} u shtua në My Cart.`);
  }

  return (
    <section className="tickets-page">
      <section className="tickets-intro">
        <div>
          <p className="eyebrow">Biletat</p>
        </div>
      </section>

      <div className="ticket-type-row">
        {ticketTypes.map((type) => (
          <button key={type.id} className={activeType?.id === type.id ? "active" : ""} onClick={() => toggleType(type)}>
            <span>{type.name}</span>
            <strong>{formatCurrency(type.price)}</strong>
          </button>
        ))}
      </div>
      {ticketMessage && <CartNotice message={ticketMessage} onClose={() => setTicketMessage("")} />}

      {activeType?.id === "single" ? (
        <section className="ticket-selection-layout">
          <div className="match-list-panel">
            <SectionHeader title="Ndeshjet" />
            <div className="match-list">
              {matches.map((match) => {
                const arena = getMatchArena(match);
                return (
                  <button
                    key={match.id}
                    className={`match-pick-btn ${selectedMatch?.id === match.id ? "active" : ""}`}
                    onClick={() => selectMatch(match)}
                  >
                    <img src={arena.imageUrl} alt={arena.name} />
                    <div>
                      <strong>{match.home} vs {match.away}</strong>
                      <span>{getMatchDisplayDate(match)} - {match.time}</span>
                      <small>{arena.name}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {selectedMatch ? (
            <TicketPickCard
              type={activeType}
              match={selectedMatch}
              quantity={quantity}
              setQuantity={setQuantity}
              onAdd={addSelectedTicket}
            />
          ) : (
            <div className="empty-state">Zgjedh një ndeshje për t'i parë detajet dhe për ta shtuar biletën në My Cart.</div>
          )}
        </section>
      ) : activeType ? (
        <div className="season-ticket-panel">
          <span className="ticket-pass-label">{activeType.name}</span>
          <h2>{ticketPassDetails[activeType.id].title}</h2>
          <p>{ticketPassDetails[activeType.id].description}</p>
          <div className="ticket-pass-perks">
            {ticketPassDetails[activeType.id].perks.map((perk) => <span key={perk}>{perk}</span>)}
          </div>
          <strong>{formatCurrency(activeType.price)}</strong>
          <label>Sa bileta?
            <div className="quantity-controls">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={15} /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}><Plus size={15} /></button>
            </div>
          </label>
          <button onClick={addSelectedTicket}><ShoppingBag size={18} /> Add to My Cart</button>
        </div>
      ) : null}

      {tickets.length > 0 && (
        <section className="generated-ticket-list">
          <SectionHeader title="Biletat e gjeneruara" />
          {tickets.map((ticket) => {
            const ticketTitle = ticket.quantityLabel || ticket.match;
            const ticketUrl = getTicketUrl(ticket);

            return (
              <article className="generated-ticket" key={ticket.id}>
                <h3>{ticket.name}</h3>
                <p>{ticketTitle}</p>
                <a className="qr-link" href={ticketUrl} aria-label="Hap faqen e biletës">
                  <QrGraphic value={ticketUrl} />
                </a>
                <span className="ticket-id">{ticket.qr}</span>
                <button onClick={() => onShowTicket(ticket)}>Shfaq QR</button>
              </article>
            );
          })}
        </section>
      )}
    </section>
  );
}

function TicketPickCard({ type, match, quantity, setQuantity, onAdd }) {
  const arena = getMatchArena(match);

  return (
    <article className="ticket-card ticket-pick-card">
      <img src={arena.imageUrl} alt={arena.name} />
      <div>
        <span className="ticket-pass-label">{type.name}</span>
        <h2>{match.home} vs {match.away}</h2>
        <p>{getMatchDisplayDate(match)} - {match.time}</p>
        <small>{arena.name}</small>
        <strong>{formatCurrency(type.price)}</strong>
        <label>Sa bileta?
          <div className="quantity-controls">
            <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={15} /></button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((current) => current + 1)}><Plus size={15} /></button>
          </div>
        </label>
        <button onClick={onAdd}><ShoppingBag size={18} /> Add to My Cart</button>
      </div>
    </article>
  );
}

function PaymentModal({ total, onClose, onFinish }) {
  const [step, setStep] = useState("customer");
  const [customer, setCustomer] = useState({ email: "", phone: "", address: "" });
  const [form, setForm] = useState({ fullName: "", cardNumber: "", expiry: "", cvv: "" });
  const customerValid = isCustomerValid(customer);
  const valid = isPaymentValid(form);

  function submit(event) {
    event.preventDefault();
    if (step === "customer") {
      if (customerValid) setStep("payment");
      return;
    }
    if (valid) onFinish(form, customer);
  }

  return (
    <div className="modal-backdrop">
      <form className="payment-modal" onSubmit={submit}>
        <SectionHeader title={step === "customer" ? "Të dhënat e porosisë" : "Të dhënat bankare"} action="Mbyll" onAction={onClose} />
        <p>Total: <strong>{formatCurrency(total)}</strong></p>
        {step === "customer" ? (
          <>
            <CustomerFields form={customer} setForm={setCustomer} />
            <button disabled={!customerValid} type="submit">Next</button>
          </>
        ) : (
          <>
            <PaymentFields form={form} setForm={setForm} />
            <button disabled={!valid} type="submit"><Check size={18} /> Finish</button>
          </>
        )}
      </form>
    </div>
  );
}

function TicketModal({ ticket, onClose, onFinish }) {
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState("customer");
  const [customer, setCustomer] = useState({ email: "", phone: "", address: "" });
  const [form, setForm] = useState({ fullName: "", cardNumber: "", expiry: "", cvv: "" });
  const customerValid = isCustomerValid(customer);
  const valid = isPaymentValid(form);
  const title = ticket.match ? `${ticket.match.home} vs ${ticket.match.away}` : ticket.type.name;

  function submit(event) {
    event.preventDefault();
    if (step === "customer") {
      if (customerValid) setStep("payment");
      return;
    }
    if (!valid) return;
    onFinish({
      name: ticket.type.name,
      match: title,
      quantityLabel: ticket.match ? `${title} - ${ticket.match.date}, ${ticket.match.time}` : title,
      date: ticket.match ? ticket.match.date : "Sezoni 2026",
      time: ticket.match ? ticket.match.time : "E vlefshme gjatë periudhës së paketës",
      arena: ticket.match ? getMatchArena(ticket.match).name : "Minatori",
      quantity,
      total: ticket.type.price * quantity,
      cardName: form.fullName,
      customer
    });
  }

  return (
    <div className="modal-backdrop">
      <form className="payment-modal" onSubmit={submit}>
        <SectionHeader title="Blej biletën" action="Mbyll" onAction={onClose} />
        <h3>{title}</h3>
        <p>Total: <strong>{formatCurrency(ticket.type.price * quantity)}</strong></p>
        {step === "customer" ? (
          <>
            <label>Sa bileta?
              <div className="quantity-controls">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={15} /></button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}><Plus size={15} /></button>
              </div>
            </label>
            <CustomerFields form={customer} setForm={setCustomer} />
            <button disabled={!customerValid} type="submit">Next</button>
          </>
        ) : (
          <>
            <PaymentFields form={form} setForm={setForm} />
            <button disabled={!valid} type="submit"><Check size={18} /> Blej</button>
          </>
        )}
      </form>
    </div>
  );
}

function CustomerFields({ form, setForm }) {
  return (
    <>
      <label>Email<input inputMode="email" placeholder="emri@example.com" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required /></label>
      <label>Numri i telefonit<input inputMode="numeric" maxLength={9} placeholder="9 shifra" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: onlyDigits(event.target.value).slice(0, 9) }))} required /></label>
      <label>Adresa<input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} required /></label>
    </>
  );
}

function PaymentFields({ form, setForm }) {
  const needsSurname = form.fullName.trim().length > 0 && !/^[a-zA-ZÀ-ž]+\s+[a-zA-ZÀ-ž\s]+$/.test(form.fullName.trim());

  return (
    <>
      <label>Emri dhe mbiemri në kartelë<input value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: onlyLetters(event.target.value) }))} required /></label>
      {needsSurname && <p className="field-error">Kërkohet edhe mbiemri.</p>}
      <label>Numri i kartelës<input inputMode="numeric" maxLength={16} value={form.cardNumber} onChange={(event) => setForm((current) => ({ ...current, cardNumber: onlyDigits(event.target.value).slice(0, 16) }))} required /></label>
      <div className="form-grid">
        <label>Skadimi<input inputMode="numeric" maxLength={5} value={form.expiry} onChange={(event) => setForm((current) => ({ ...current, expiry: formatExpiry(event.target.value) }))} required /></label>
        <label>CVV<input inputMode="numeric" maxLength={3} value={form.cvv} onChange={(event) => setForm((current) => ({ ...current, cvv: onlyDigits(event.target.value).slice(0, 3) }))} required /></label>
      </div>
    </>
  );
}

function NotificationsView({ notifications, orders }) {
  return (
    <section className="notifications-page">
      <SectionHeader title="Notifications" />
      {notifications.length === 0 ? <div className="empty-state">Ende nuk ke njoftime. Kur porosia kryhet, njoftimi shfaqet këtu.</div> : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <article className="notification-card" key={notification.id}>
              <span className="notification-icon"><Bell size={18} /></span>
              <div>
                <h3>{notification.title}</h3>
                <p>{notification.text}</p>
                <time>{formatDateTimeLabel(notification.createdAt)}</time>
              </div>
              <StatusBadge status={notification.status} />
            </article>
          ))}
        </div>
      )}
      {orders.length > 0 && <OrdersPanel orders={orders} />}
    </section>
  );
}

function OrdersPanel({ orders }) {
  return (
    <section className="table-panel orders-panel">
      <SectionHeader title="Porositë e tua" />
      {orders.map((order) => <article className="order-card" key={order.id}><strong>#{order.id}</strong><span>{formatCurrency(order.total)}</span></article>)}
    </section>
  );
}

function QrGraphic({ value }) {
  return <img className="real-qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(value)}`} alt="QR code" />;
}

function TicketQrModal({ ticket, onClose }) {
  const qrValue = getTicketUrl(ticket);

  return (
    <div className="modal-backdrop">
      <section className="ticket-qr-modal">
        <SectionHeader title="Bileta u ble me sukses" action="Mbyll" onAction={onClose} />
        <h3>{ticket.name}</h3>
        <p>{ticket.quantityLabel || ticket.match}</p>
        <a className="qr-link" href={qrValue} aria-label="Hap faqen e biletës">
          <QrGraphic value={qrValue} />
        </a>
        <span className="ticket-id">{ticket.qr}</span>
        <a className="ticket-link" href={qrValue}>Hap faqen e biletës</a>
        <p>Ruaje ose fotografoje këtë QR kod për hyrje në ndeshje.</p>
      </section>
    </div>
  );
}

function PublicTicketPage({ ticket }) {
  const isInvalid = ticket.scanStatus === "invalid";

  return (
    <main className={`public-ticket-page ${isInvalid ? "invalid" : ""}`}>
      <section className="public-ticket-card">
        <Brand />
        <button className="text-button public-ticket-back" onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign(window.location.pathname)}>Back</button>
        <span className={`public-ticket-status ${isInvalid ? "invalid" : "valid"}`}>{isInvalid ? "Biletë invalide" : "Biletë valide"}</span>
        <div>
          <p className="eyebrow">Trepça Fanshop</p>
          <h1>{ticket.match}</h1>
          <p>{ticket.name}</p>
        </div>
        <div className="ticket-detail-grid">
          <span><strong>Data</strong>{ticket.date}</span>
          <span><strong>Ora</strong>{ticket.time}</span>
          <span><strong>Salla</strong>{ticket.arena}</span>
          <span><strong>Çmimi</strong>{formatCurrency(ticket.total || 0)}</span>
        </div>
        <div className="ticket-code-panel">
          <span>Kodi i biletës</span>
          <strong>{ticket.qr}</strong>
        </div>
        <p className="public-ticket-note">{isInvalid ? "Kjo biletë është skanuar më herët dhe nuk pranohet për hyrje të dytë." : "Kjo është hapja e parë e kësaj bilete. Pas këtij skanimi, hapjet e tjera shfaqen invalide."}</p>
      </section>
    </main>
  );
}

function SectionHeader({ title, action, onAction }) {
  return <div className="section-header"><h2>{title}</h2>{action && <button type="button" className="text-button" onClick={onAction}>{action}</button>}</div>;
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function createPurchasedTickets(cart, orderId, customer) {
  return cart.flatMap((item) => {
    if (item.itemType !== "ticket") return [];
    const purchasedAt = `${orderId}-${item.id}`;
    return Array.from({ length: item.quantity }, (_, index) => {
      const qr = `TRP-${purchasedAt}-${index + 1}`;
      const ticket = {
        id: `${purchasedAt}-${index + 1}`,
        qr,
        name: item.ticket.name,
        match: item.ticket.match,
        quantityLabel: item.ticket.quantityLabel,
        date: item.ticket.date,
        time: item.ticket.time,
        arena: item.ticket.arena,
        ticketNumber: index + 1,
        quantity: 1,
        total: item.unitPrice,
        customer
      };

      return {
        ...ticket,
        ticketUrl: createTicketUrl(ticket)
      };
    });
  });
}

function getCartItemName(item) {
  return item.itemType === "ticket" ? item.ticket.match : item.product.name;
}

function getCartItemCategory(item) {
  return item.itemType === "ticket" ? item.ticket.name : item.product.category;
}

function getCartItemPrice(item) {
  return item.itemType === "ticket" ? item.unitPrice : item.product.price;
}

function getCartItemTotal(item) {
  return getCartItemPrice(item) * item.quantity;
}

function getTicketUrl(ticket) {
  return ticket.ticketUrl || createTicketUrl(normalizeTicket(ticket));
}

function normalizeTicket(ticket) {
  return {
    qr: ticket.qr,
    name: ticket.name || "Biletë",
    match: ticket.match || ticket.quantityLabel || "Biletë Trepça",
    date: ticket.date || "Data e ndeshjes",
    time: ticket.time || "Ora e ndeshjes",
    arena: ticket.arena || "Minatori",
    total: ticket.total || 0
  };
}

function createTicketUrl(ticket) {
  if (typeof window === "undefined") return ticket.qr;
  const publicTicket = normalizeTicket(ticket);

  return `${window.location.origin}${window.location.pathname}#ticket=${encodeURIComponent(encodeTicket(publicTicket))}`;
}

function readTicketFromUrl() {
  if (typeof window === "undefined" || !window.location.hash.startsWith("#ticket=")) return null;
  const ticket = decodeTicket(decodeURIComponent(window.location.hash.replace("#ticket=", "")));
  if (!ticket?.qr) return ticket;

  const scanKey = `trepca_ticket_scan_${ticket.qr}`;
  const scans = Number(localStorage.getItem(scanKey) || "0");
  localStorage.setItem(scanKey, String(scans + 1));
  return { ...ticket, scanStatus: scans > 0 ? "invalid" : "valid", scanCount: scans + 1 };
}

function encodeTicket(ticket) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(ticket))));
}

function decodeTicket(value) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(value))));
  } catch {
    return null;
  }
}

function getMatchArena(match) {
  if (match.arenaImageUrl) {
    return {
      name: match.arenaName || getClubByShortName(match.venueClub || match.home)?.arenaName || TREPCA_CLUB.arenaName,
      imageUrl: match.arenaImageUrl
    };
  }
  const club = getClubByShortName(match.venueClub || match.home) || TREPCA_CLUB;
  return { name: club.arenaName, imageUrl: club.imageUrl };
}

function isClothing(product) {
  return product.category === "Clothing" || product.category === "Jerseys";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(value);
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function onlyLetters(value) {
  return value.replace(/[^a-zA-ZÀ-ž\s]/g, "");
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isPaymentValid(form) {
  return /^[a-zA-ZÀ-ž]+\s+[a-zA-ZÀ-ž\s]+$/.test(form.fullName.trim()) && /^\d{16}$/.test(form.cardNumber) && /^\d{2}\/\d{2}$/.test(form.expiry) && /^\d{3}$/.test(form.cvv);
}

function isCustomerValid(form) {
  return /^[^\s@]+@[^\s@]+\.com$/i.test(form.email.trim()) && /^\d{9}$/.test(form.phone) && form.address.trim().length >= 3;
}
