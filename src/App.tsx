import { useState, useEffect } from 'react';
import { CartItem } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Reviews from './components/Reviews';
import InfoSection from './components/InfoSection';
import RestaurantDashboard from './components/RestaurantDashboard';
import UserProfileModal from './components/UserProfileModal';
import GourmetBackgroundEmojis from './components/GourmetBackgroundEmojis';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const handleReorder = (items: CartItem[]) => {
    setCartItems((prevItems) => {
      const updated = [...prevItems];
      items.forEach((newItem) => {
        const existingIndex = updated.findIndex((item) => {
          const nameMatch = item.name.en === newItem.name.en;
          const sizeMatch = item.size === newItem.size;
          const optsMatch = item.selectedOptions?.length === newItem.selectedOptions?.length &&
            (item.selectedOptions || []).every(o => (newItem.selectedOptions || []).some(no => no.en === o.en));
          return nameMatch && sizeMatch && optsMatch;
        });

        if (existingIndex > -1) {
          updated[existingIndex].quantity += newItem.quantity;
        } else {
          updated.push({ ...newItem });
        }
      });
      return updated;
    });
  };

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('view_pizza_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to restore previous basket state', e);
      }
    }

    // Set initial active section by scroll detection
    const handleScroll = () => {
      const sections = ['hero', 'menu', 'reviews', 'about'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save cart to localStorage on mutation
  useEffect(() => {
    localStorage.setItem('view_pizza_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevItems, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleScrollToMenu = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('menu');
    }
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const isRtl = lang === 'ar';

  return (
    <div 
      className="min-h-screen bg-brand-black flex flex-col justify-between" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Dynamic Notification bar for Qatari customers */}
      <div className="bg-brand-red text-white py-2 text-center text-xs font-semibold px-4 flex items-center justify-center gap-2 select-none shadow-md font-mono">
        <span>🎉 {isRtl ? 'خدمة السيارات طازجة وسريعة متوفرة طوال اليوم' : 'Fast and hot Drive-Through Service Active Everyday!'}</span>
        <span className="opacity-40">|</span>
        <a href="tel:+97477500020" className="underline hover:text-brand-yellow transition inline-flex items-center gap-1">
          <span dir="ltr">7750 0020</span>
        </a>
      </div>

      {/* Header / Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Content sections */}
      <main className="flex-grow relative overflow-hidden">
        {/* Restaurant environment floating emojis layer */}
        <GourmetBackgroundEmojis />

        <Hero 
          lang={lang} 
          onScrollToMenu={handleScrollToMenu} 
        />
        <Menu 
          lang={lang} 
          onAddToCart={handleAddToCart} 
        />
        <Reviews 
          lang={lang} 
          />
        <InfoSection 
          lang={lang} 
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Slide-over Selections Panel (Cart) */}
      <Cart
        lang={lang}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Customer profile and past orders manager */}
      <UserProfileModal
        lang={lang}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onReorder={handleReorder}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Real-time Order Monitoring Kitchen Console (Restaurant Portal) */}
      {isAdminOpen && (
        <RestaurantDashboard
          lang={lang}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

