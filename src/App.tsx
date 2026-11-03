import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CakeSlice,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  UserRound,
  UtensilsCrossed,
  X,
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  type: 'cake' | 'pizza';
  price: number | null;
  image: string;
  description: string;
  category: string;
  size?: string;
};

type CartItem = Product & {
  quantity: number;
  customization?: string;
};

type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  customer: string;
  status: string;
};

const cakeImage = 'https://images.pexels.com/photos/39240987/pexels-photo-39240987.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const chocolateImage = 'https://images.pexels.com/photos/10249461/pexels-photo-10249461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const pastryImage = 'https://images.pexels.com/photos/39240986/pexels-photo-39240986.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const pizzaImage = 'https://images.pexels.com/photos/35760003/pexels-photo-35760003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const cakes: Product[] = [
  ['vanilla', 'Vanilla', 500, cakeImage, 'Soft vanilla sponge with silky cream and a gentle sweetness.', 'Classic'],
  ['black-forest', 'Black Forest', 600, chocolateImage, 'Dark chocolate layers, cherries and clouds of fresh cream.', 'Classic'],
  ['chocolate', 'Chocolate', 600, chocolateImage, 'A deeply chocolatey celebration cake with smooth ganache.', 'Chocolate'],
  ['pineapple', 'Pineapple', 550, pastryImage, 'Bright pineapple and vanilla cream tucked between fluffy layers.', 'Fruit'],
  ['strawberry', 'Strawberry', 550, cakeImage, 'Fresh strawberry notes, light cream and a pretty finish.', 'Fruit'],
  ['blue-berry', 'Blue Berry', 700, cakeImage, 'Velvety berry cream with a hint of citrus freshness.', 'Fruit'],
  ['butter-scotch', 'Butter Scotch', 750, pastryImage, 'Caramel crunch, buttery cream and a golden finish.', 'Signature'],
  ['truffle-chocolate', 'Truffle Chocolate', 1000, chocolateImage, 'Rich truffle layers for the serious chocolate lover.', 'Signature'],
  ['vanilla-chocolate', 'Vanilla Chocolate', 550, chocolateImage, 'The best of both worlds in a soft, elegant layer cake.', 'Classic'],
].map(([id, name, price, image, description, category]) => ({ id: id as string, name: name as string, price: price as number, image: image as string, description: description as string, category: category as string, type: 'cake' }));

const pizzas: Product[] = [
  { id: 'veg-small', name: 'Veg Pizza', type: 'pizza', price: 150, size: 'Small', image: pizzaImage, description: 'A fresh, colourful garden of vegetables and melted cheese.', category: 'Veg' },
  { id: 'veg-medium', name: 'Veg Pizza', type: 'pizza', price: 350, size: 'Medium', image: pizzaImage, description: 'A fresh, colourful garden of vegetables and melted cheese.', category: 'Veg' },
  { id: 'veg-large', name: 'Veg Pizza', type: 'pizza', price: null, size: 'Large', image: pizzaImage, description: 'A fresh, colourful garden of vegetables and melted cheese.', category: 'Veg' },
  { id: 'chicken-small', name: 'Chicken Pizza', type: 'pizza', price: 200, size: 'Small', image: pizzaImage, description: 'Tender chicken, herbs and cheese on a crisp, golden base.', category: 'Chicken' },
  { id: 'chicken-medium', name: 'Chicken Pizza', type: 'pizza', price: 400, size: 'Medium', image: pizzaImage, description: 'Tender chicken, herbs and cheese on a crisp, golden base.', category: 'Chicken' },
  { id: 'chicken-large', name: 'Chicken Pizza', type: 'pizza', price: 800, size: 'Large', image: pizzaImage, description: 'Tender chicken, herbs and cheese on a crisp, golden base.', category: 'Chicken' },
];

const money = (amount: number) => `Rs. ${amount.toLocaleString('en-IN')}`;

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('cake-cart') || '[]'));
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('cake-wishlist') || '[]'));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('cake-orders') || '[]'));
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customize, setCustomize] = useState<Product | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cakeFilter, setCakeFilter] = useState('All');
  const [sortPrice, setSortPrice] = useState('featured');
  const [welcome, setWelcome] = useState(() => !sessionStorage.getItem('cake-welcome'));
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('cake-profile') || 'null'));
  const [dark, setDark] = useState(() => localStorage.getItem('cake-dark') === 'true');

  useEffect(() => localStorage.setItem('cake-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('cake-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('cake-orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('cake-dark', String(dark)), [dark]);

  const filteredCakes = useMemo(() => cakes.filter((cake) => {
    const matchesSearch = cake.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = cakeFilter === 'All' || cake.category === cakeFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => sortPrice === 'low' ? (a.price || 0) - (b.price || 0) : sortPrice === 'high' ? (b.price || 0) - (a.price || 0) : 0), [search, cakeFilter, sortPrice]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setMobileMenu(false);
  };

  const addToCart = (product: Product, customization?: string) => {
    if (!product.price) return;
    setCart((current) => {
      const key = `${product.id}-${customization || ''}`;
      const found = current.find((item) => `${item.id}-${item.customization || ''}` === key);
      return found ? current.map((item) => `${item.id}-${item.customization || ''}` === key ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1, customization }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (index: number, amount: number) => setCart((current) => current.map((item, i) => i === index ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
  const removeItem = (index: number) => setCart((current) => current.filter((_, i) => i !== index));
  const toggleWishlist = (id: string) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const sendWhatsAppOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '');
    const phone = String(form.get('phone') || '');
    const orderType = String(form.get('orderType') || 'Home Delivery');
    const address = String(form.get('address') || '');
    const date = String(form.get('date') || '');
    const time = String(form.get('time') || '');
    const payment = String(form.get('payment') || 'Cash on Delivery');
    const transaction = String(form.get('transaction') || 'Not provided');
    const instructions = String(form.get('instructions') || 'None');
    const itemLines = cart.map((item, index) => `${index + 1}. ${item.name}${item.size ? ` (${item.size})` : ''}\n   Price: ${item.price ? money(item.price) : 'Contact for Price'}\n   Quantity: ${item.quantity}${item.customization ? `\n   Customization: ${item.customization}` : ''}`).join('\n\n');
    const message = `NEW ORDER - THE CAKE FACTORY AND BAKERY\n\nCustomer Name: ${name}\nPhone: ${phone}\n\nORDER ITEMS:\n${itemLines}\n\nSubtotal: ${money(cartTotal)}\nGrand Total: ${money(cartTotal)}\n\nOrder Type: ${orderType}\nAddress: ${address || 'Pickup at bakery'}\nPreferred Date: ${date}\nPreferred Time: ${time}\n\nPayment Method: ${payment}\nTransaction Reference: ${transaction}\n\nSpecial Instructions: ${instructions}\n\nPlease confirm this order.`;
    const order: Order = { id: `TCF-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), items: cart, total: cartTotal, customer: name, status: 'WhatsApp Opened' };
    setOrders((current) => [order, ...current]);
    window.open(`https://wa.me/9779707597002?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setCheckoutOpen(false);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextProfile = { name: String(form.get('profileName') || ''), phone: String(form.get('profilePhone') || ''), email: String(form.get('profileEmail') || '') };
    setProfile(nextProfile);
    localStorage.setItem('cake-profile', JSON.stringify(nextProfile));
  };

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className="announcement"><Sparkles size={14} /> Freshly baked in Kalikanagar, Butwal <span>•</span> WhatsApp orders welcome <a href="tel:9707597002">9707597002</a></div>
      <header className="nav-wrap">
        <nav className="nav container">
          <button className="brand" onClick={() => scrollTo('home')}><span className="brand-mark"><CakeSlice size={20} /></span><span>The Cake Factory<small>& Bakery</small></span></button>
          <div className={mobileMenu ? 'nav-links open' : 'nav-links'}>{['home', 'about', 'cakes', 'pizza', 'gallery', 'offers', 'contact'].map((item) => <button key={item} className={activeSection === item ? 'active' : ''} onClick={() => scrollTo(item)}>{item === 'home' ? 'Home' : item.charAt(0).toUpperCase() + item.slice(1)}</button>)}</div>
          <div className="nav-actions"><button className="icon-button search-button" onClick={() => scrollTo('cakes')} aria-label="Search cakes"><Search size={19} /></button><button className="account-button" onClick={() => setAccountOpen(true)}><UserRound size={17} /> <span>{profile?.name || 'My Account'}</span></button><button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><b>{cartCount}</b></button><button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu"><Menu size={22} /></button></div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero"><div className="hero-image"><img src={cakeImage} alt="Beautiful celebration cakes" /></div><div className="hero-copy container"><p className="eyebrow"><span /> BUTWAL'S SWEETEST ADDRESS</p><h1>Freshly baked<br /><em>happiness,</em><br />made with love.</h1><p className="hero-text">Delicious cakes, freshly prepared pizzas and sweet moments for every celebration.</p><div className="hero-buttons"><button className="button primary" onClick={() => scrollTo('cakes')}>Explore our cakes <ArrowRight size={16} /></button><button className="button text-button" onClick={() => scrollTo('pizza')}>Order pizza <ArrowRight size={16} /></button></div><div className="hero-note"><div className="avatar-stack"><span>TC</span><span>♡</span><span>★</span></div><p><strong>Made fresh, just for you.</strong><br />Every order is a little celebration.</p></div></div><div className="hero-stamp"><Star size={15} fill="currentColor" /> Baked today<br /><strong>with care</strong></div></section>

        <section className="trust-bar"><div><span className="trust-icon"><Sparkles size={18} /></span><p><strong>Freshly prepared</strong><small>Made to order, always</small></p></div><div><span className="trust-icon"><UtensilsCrossed size={18} /></span><p><strong>Premium ingredients</strong><small>Only the good stuff</small></p></div><div><span className="trust-icon"><Heart size={18} /></span><p><strong>Made with love</strong><small>From our family to yours</small></p></div><div><span className="trust-icon"><Phone size={18} /></span><p><strong>Easy WhatsApp ordering</strong><small>We are one message away</small></p></div></section>

        <section id="about" className="section about-section container"><div className="about-photo"><img src={pastryImage} alt="Fresh bakery creations" /><div className="photo-label"><span>Since today</span><strong>Good things<br />take time.</strong></div></div><div className="about-copy"><p className="eyebrow">A LITTLE ABOUT US</p><h2>Small moments.<br /><em>Big memories.</em></h2><p>At The Cake Factory & Bakery, we believe the best celebrations begin with something made by hand. From a quiet slice of cake to a table full of hungry friends, our kitchen is here for life's delicious in-between moments.</p><p>Our cakes are finished with patience, our pizzas are served warm, and every order is made with the kind of care we would serve our own family.</p><button className="button outline" onClick={() => scrollTo('contact')}>Visit our bakery <MapPin size={16} /></button></div></section>

        <section id="cakes" className="section catalog-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">THE CAKE COUNTER</p><h2>Choose your <em>sweet thing.</em></h2></div><p className="section-intro">From familiar favourites to rich, celebratory layers. Every cake starts with a little joy.</p></div><div className="catalog-toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cakes..." /></div><div className="filter-pills">{['All', 'Classic', 'Chocolate', 'Fruit', 'Signature'].map((filter) => <button key={filter} className={cakeFilter === filter ? 'selected' : ''} onClick={() => setCakeFilter(filter)}>{filter}</button>)}</div><label className="sort-select">Sort <select value={sortPrice} onChange={(event) => setSortPrice(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={14} /></label></div><div className="product-grid">{filteredCakes.map((cake) => <ProductCard key={cake.id} product={cake} wished={wishlist.includes(cake.id)} onWish={toggleWishlist} onAdd={addToCart} onCustomize={setCustomize} />)}</div></div></section>

        <section id="pizza" className="pizza-section"><div className="container pizza-inner"><div className="pizza-copy"><p className="eyebrow">FROM THE OVEN</p><h2>Pizza night,<br /><em>done right.</em></h2><p>Golden edges, generous toppings and a whole lot of comfort. Pick your favourite and let us make it fresh.</p><div className="pizza-options">{pizzas.filter((pizza) => pizza.price).map((pizza) => <button key={pizza.id} className="pizza-row" onClick={() => addToCart(pizza)}><span><strong>{pizza.category} pizza</strong><small>{pizza.size} · freshly baked</small></span><b>{money(pizza.price || 0)}</b><Plus size={17} /></button>)}</div><p className="contact-price">Large veg pizza? <a href="tel:9707597002">Contact us for price</a></p></div><div className="pizza-visual"><img src={pizzaImage} alt="Fresh pizza dough being prepared" /><div className="pizza-badge"><span>Hot from<br />the oven</span><UtensilsCrossed size={23} /></div></div></div></section>

        <section id="gallery" className="section gallery-section container"><div className="section-heading"><div><p className="eyebrow">FROM OUR KITCHEN</p><h2>Made for <em>the moment.</em></h2></div><p className="section-intro">A little peek at the sweetness and craft behind every order.</p></div><div className="gallery-grid"><img src={cakeImage} alt="Cake collection" /><img src={chocolateImage} alt="Chocolate cake" /><img src={pastryImage} alt="Bakery pastry" /><div className="gallery-quote"><Star size={17} fill="currentColor" /><p>“The best things in life are better with cake.”</p><span>— Our kitchen</span></div></div></section>

        <section id="offers" className="offers-section"><div className="container offer-card"><div><p className="eyebrow">CELEBRATIONS WELCOME</p><h2>Have something<br /><em>special in mind?</em></h2><p>Tell us what you are celebrating. We love turning your ideas into the centrepiece of the table.</p><button className="button dark-button" onClick={() => setCustomize(cakes[2])}>Start a custom cake <ArrowRight size={16} /></button></div><div className="offer-art"><CakeSlice size={82} strokeWidth={1} /><span>Custom<br />made</span></div></div></section>

        <section id="contact" className="section contact-section container"><div className="contact-copy"><p className="eyebrow">COME SAY HELLO</p><h2>We would love<br /><em>to meet you.</em></h2><p>Drop by for a warm slice, call us for a celebration, or send a WhatsApp message when you are ready to order.</p><div className="contact-details"><a href="https://www.google.com/maps/search/?api=1&query=The%20Cake%20Factory%20and%20Bakery%2C%20Kalikanagar%2C%20Butwal%2C%20Lumbini%2C%20Nepal" target="_blank" rel="noreferrer"><MapPin size={18} /><span><strong>Find us</strong>Kalikanagar, Butwal, Lumbini, Nepal</span></a><a href="tel:9707597002"><Phone size={18} /><span><strong>Call us</strong>9707597002 · 9861816248 · 9764350410</span></a><a href="mailto:hello@thecakefactory.example"><Mail size={18} /><span><strong>Hours</strong>Every day · 8:00 AM — 8:00 PM</span></a></div></div><div className="contact-card"><div className="contact-card-top"><span>ORDER SOMETHING LOVELY</span><Sparkles size={19} /></div><h3>Let’s make<br />your day sweeter.</h3><p>For the quickest response, message us on WhatsApp.</p><a className="button primary full-button" href="https://wa.me/9779707597002" target="_blank" rel="noreferrer">WhatsApp us <ArrowRight size={16} /></a><a className="call-link" href="tel:9707597002"><Phone size={15} /> Or call 9707597002</a></div></section>
      </main>

      <footer><div className="container footer-grid"><div className="footer-brand"><button className="brand" onClick={() => scrollTo('home')}><span className="brand-mark"><CakeSlice size={20} /></span><span>The Cake Factory<small>& Bakery</small></span></button><p>Sweet moments, freshly baked in the heart of Butwal.</p><div className="socials"><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17} /></a><a href="https://wa.me/9779707597002" target="_blank" rel="noreferrer"><Phone size={17} /></a></div></div><div><h4>Explore</h4><button onClick={() => scrollTo('cakes')}>Cakes</button><button onClick={() => scrollTo('pizza')}>Pizza</button><button onClick={() => scrollTo('gallery')}>Gallery</button><button onClick={() => scrollTo('offers')}>Custom orders</button></div><div><h4>Visit</h4><p>Kalikanagar, Butwal<br />Lumbini, Nepal</p><a href="tel:9707597002">9707597002</a><a href="tel:9861816248">9861816248</a></div><div><h4>Good to know</h4><p>Made fresh daily.<br />WhatsApp ordering available.<br />Local pickup and delivery.</p><button className="footer-account" onClick={() => setAccountOpen(true)}>My account <ArrowRight size={14} /></button></div></div><div className="container copyright"><span>© 2026 The Cake Factory & Bakery</span><span>Accounts and saved details stay on this browser.</span></div></footer>

      {welcome && <div className="modal-backdrop"><div className="welcome-modal"><button className="close-button" onClick={() => { setWelcome(false); sessionStorage.setItem('cake-welcome', 'true'); }}><X size={18} /></button><div className="welcome-icon"><CakeSlice size={27} /></div><p className="eyebrow">WELCOME IN</p><h2>A little sweetness<br /><em>goes a long way.</em></h2><p>Thanks for stopping by The Cake Factory. Take your time, choose something lovely, and let us bake the rest.</p><button className="button primary full-button" onClick={() => { setWelcome(false); sessionStorage.setItem('cake-welcome', 'true'); }}>Explore the bakery <ArrowRight size={16} /></button></div></div>}
      {customize && <CustomizeModal product={customize} onClose={() => setCustomize(null)} onAdd={(details) => { addToCart(customize, details); setCustomize(null); }} />}
      {cartOpen && <CartDrawer cart={cart} total={cartTotal} onClose={() => setCartOpen(false)} onUpdate={updateQuantity} onRemove={removeItem} onClear={() => setCart([])} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} onClose={() => setCheckoutOpen(false)} onSubmit={sendWhatsAppOrder} />}
      {accountOpen && <AccountModal profile={profile} orders={orders} wishlist={wishlist} cartCount={cartCount} dark={dark} onClose={() => setAccountOpen(false)} onSave={saveProfile} onToggleDark={() => setDark(!dark)} onClear={() => { localStorage.clear(); setCart([]); setWishlist([]); setOrders([]); setProfile(null); }} />}
    </div>
  );
}

function ProductCard({ product, wished, onWish, onAdd, onCustomize }: { product: Product; wished: boolean; onWish: (id: string) => void; onAdd: (product: Product) => void; onCustomize: (product: Product) => void }) {
  return <article className="product-card"><div className="product-image"><img src={product.image} alt={product.name} /><button className={wished ? 'wish-button wished' : 'wish-button'} onClick={() => onWish(product.id)} aria-label="Add to wishlist"><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button><span className="product-tag">{product.category}</span></div><div className="product-content"><div className="product-title"><h3>{product.name}</h3><strong>{money(product.price || 0)}</strong></div><p>{product.description}</p><div className="product-actions"><button className="customize-button" onClick={() => onCustomize(product)}>Customize <ArrowRight size={14} /></button><button className="add-button" onClick={() => onAdd(product)}><Plus size={17} /></button></div></div></article>;
}

function CustomizeModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (details: string) => void }) {
  const [weight, setWeight] = useState('1 lb');
  const [message, setMessage] = useState('');
  return <div className="modal-backdrop"><div className="form-modal customize-modal"><div className="modal-head"><div><p className="eyebrow">MAKE IT YOURS</p><h2>{product.name}</h2></div><button className="close-button" onClick={onClose}><X size={18} /></button></div><img className="modal-product-image" src={product.image} alt={product.name} /><div className="custom-grid"><label>Cake weight<select value={weight} onChange={(event) => setWeight(event.target.value)}>{['0.5 lb', '1 lb', '1.5 lb', '2 lb', '2.5 lb', '3 lb'].map((size) => <option key={size}>{size}</option>)}</select></label><label>Birthday name<input placeholder="e.g. Anisha" /></label><label className="wide">Cake message<input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Happy birthday..." /></label><label className="wide">Special instructions<textarea placeholder="Any little details we should know?" /></label></div><div className="price-note"><span>Starting price <strong>{money(product.price || 0)}</strong></span><small>Final price for custom weight or details may be confirmed by our bakery team.</small></div><button className="button primary full-button" onClick={() => onAdd(`${weight}${message ? `, message: ${message}` : ''}`)}>Add customized cake <Plus size={17} /></button></div></div>;
}

function CartDrawer({ cart, total, onClose, onUpdate, onRemove, onClear, onCheckout }: { cart: CartItem[]; total: number; onClose: () => void; onUpdate: (index: number, amount: number) => void; onRemove: (index: number) => void; onClear: () => void; onCheckout: () => void }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR BASKET</p><h2>{cart.length ? `${cart.reduce((sum, item) => sum + item.quantity, 0)} items` : 'A little empty'}</h2></div><button className="close-button" onClick={onClose}><X size={18} /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item, index) => <div className="cart-item" key={`${item.id}-${index}`}><img src={item.image} alt={item.name} /><div className="cart-item-info"><h3>{item.name}</h3><span>{item.size || item.customization || 'Classic cake'}</span><strong>{item.price ? money(item.price * item.quantity) : 'Contact for Price'}</strong><div className="quantity"><button onClick={() => onUpdate(index, -1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => onUpdate(index, 1)}><Plus size={13} /></button></div></div><button className="remove-button" onClick={() => onRemove(index)}><Trash2 size={15} /></button></div>)}</div><div className="drawer-bottom"><div className="subtotal"><span>Subtotal</span><strong>{money(total)}</strong></div><p>Delivery charges, if applicable, will be confirmed by our team.</p><button className="button primary full-button" onClick={onCheckout}>Proceed to checkout <ArrowRight size={16} /></button><button className="clear-button" onClick={onClear}>Clear basket</button></div></> : <div className="empty-cart"><ShoppingBag size={36} /><p>Your basket is waiting for something lovely.</p><button className="button outline" onClick={onClose}>Continue shopping</button></div>}</aside></div>;
}

function CheckoutModal({ cart, total, onClose, onSubmit }: { cart: CartItem[]; total: number; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const [delivery, setDelivery] = useState('Home Delivery');
  return <div className="modal-backdrop"><div className="form-modal checkout-modal"><div className="modal-head"><div><p className="eyebrow">ALMOST THERE</p><h2>Complete your order.</h2></div><button className="close-button" onClick={onClose}><X size={18} /></button></div><form onSubmit={onSubmit}><div className="checkout-layout"><div className="checkout-fields"><div className="form-section-title"><UserRound size={17} /> Your details</div><div className="two-col"><label>Full name<input name="name" required placeholder="Your full name" /></label><label>Contact number<input name="phone" required type="tel" placeholder="98XXXXXXXX" /></label></div><label>Alternative phone <span>(optional)</span><input name="alternative" type="tel" placeholder="98XXXXXXXX" /></label><div className="form-section-title"><Truck size={17} /> Delivery or pickup</div><div className="delivery-toggle"><button type="button" className={delivery === 'Home Delivery' ? 'selected' : ''} onClick={() => setDelivery('Home Delivery')}>Home delivery</button><button type="button" className={delivery === 'Pickup' ? 'selected' : ''} onClick={() => setDelivery('Pickup')}>Pickup</button></div><input type="hidden" name="orderType" value={delivery} />{delivery === 'Home Delivery' && <label>Complete delivery address<input name="address" required placeholder="Street, area, landmark" /></label>}<div className="two-col"><label>Preferred date<input name="date" required type="date" /><CalendarDays size={16} /></label><label>Preferred time<input name="time" required type="time" /><Clock3 size={16} /></label></div><label>Special order instructions <span>(optional)</span><textarea name="instructions" placeholder="Any notes for our team?" /></label><div className="form-section-title"><Sparkles size={17} /> Payment</div><div className="payment-choice"><label><input type="radio" name="payment" value="QR Payment" defaultChecked /> QR payment</label><label><input type="radio" name="payment" value="Cash on Delivery / Pickup" /> Cash on delivery / pickup</label></div><div className="qr-box"><img src="/images/IMG-20261102-WA0007.jpg" alt="The Cake Factory eSewa payment QR code" /><div><strong>Scan & pay</strong><p>Use the exact amount shown below. Payment will be confirmed by our bakery team.</p><label>Transaction ID <span>(optional)</span><input name="transaction" placeholder="eSewa reference number" /></label></div></div></div><aside className="order-summary"><p className="eyebrow">YOUR ORDER</p><div>{cart.map((item, index) => <div className="summary-item" key={`${item.id}-${index}`}><span>{item.quantity} × {item.name}{item.size ? ` · ${item.size}` : ''}</span><strong>{item.price ? money(item.price * item.quantity) : 'Contact'}</strong></div>)}</div><div className="summary-total"><span>Grand total</span><strong>{money(total)}</strong></div><p className="summary-note">No delivery fee has been added. Our team will confirm any applicable charge on WhatsApp.</p><button className="button primary full-button" type="submit">Place order on WhatsApp <ArrowRight size={16} /></button><p className="whatsapp-note">WhatsApp will open with your order ready. Please press Send to confirm.</p></aside></div></form></div></div>;
}

function AccountModal({ profile, orders, wishlist, cartCount, dark, onClose, onSave, onToggleDark, onClear }: { profile: { name?: string; phone?: string; email?: string } | null; orders: Order[]; wishlist: string[]; cartCount: number; dark: boolean; onClose: () => void; onSave: (event: React.FormEvent<HTMLFormElement>) => void; onToggleDark: () => void; onClear: () => void }) {
  const [tab, setTab] = useState('Overview');
  return <div className="modal-backdrop"><div className="form-modal account-modal"><div className="modal-head"><div><p className="eyebrow">YOUR SPACE</p><h2>{profile?.name || 'My account'}</h2></div><button className="close-button" onClick={onClose}><X size={18} /></button></div><div className="account-layout"><div className="account-tabs">{['Overview', 'My Orders', 'My Profile', 'Settings'].map((item) => <button key={item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)}>{item}</button>)}</div><div className="account-content">{tab === 'Overview' && <><div className="account-welcome"><span className="welcome-icon"><CakeSlice size={23} /></span><div><h3>Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}.</h3><p>Your sweet little corner of the bakery.</p></div></div><div className="stat-grid"><div><strong>{orders.length}</strong><span>Local orders</span></div><div><strong>{cartCount}</strong><span>In your basket</span></div><div><strong>{wishlist.length}</strong><span>Wishlist items</span></div></div><div className="local-note"><Sparkles size={17} /><p>Your account, orders and preferences are saved on this device only. They do not automatically transfer to another phone or browser.</p></div></>}{tab === 'My Orders' && <div className="orders-list">{orders.length ? orders.map((order) => <div className="order-row" key={order.id}><div><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} products</span></div><div><b>{money(order.total)}</b><small><Check size={12} /> {order.status}</small></div></div>) : <div className="empty-state"><ShoppingBag size={28} /><p>Your confirmed WhatsApp orders will appear here.</p></div>}</div>}{tab === 'My Profile' && <form className="profile-form" onSubmit={onSave}><label>Full name<input name="profileName" defaultValue={profile?.name || ''} required /></label><label>Phone number<input name="profilePhone" defaultValue={profile?.phone || ''} required /></label><label>Email address <span>(optional)</span><input name="profileEmail" type="email" defaultValue={profile?.email || ''} /></label><button className="button primary" type="submit">Save profile <Check size={15} /></button></form>}{tab === 'Settings' && <div className="settings-list"><button onClick={onToggleDark}><span><Sparkles size={17} /><strong>Display mode</strong><small>{dark ? 'Dark mode is on' : 'Light mode is on'}</small></span><span className="setting-value">{dark ? 'Dark' : 'Light'}</span></button><button onClick={onClear}><span><Trash2 size={17} /><strong>Clear local data</strong><small>Remove this browser's saved account and orders</small></span><span className="setting-value danger">Clear</span></button></div>}</div></div></div></div>;
}

export default App;
