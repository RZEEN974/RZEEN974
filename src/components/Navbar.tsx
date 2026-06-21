import { LayoutGrid, ShoppingBag, Menu, X, Phone, MapPin, Globe, User } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile?: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({
  lang,
  setLang,
  cartCount,
  onOpenCart,
  onOpenProfile,
  activeSection,
  setActiveSection,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: { en: 'Home', ar: 'الرئيسية' } },
    { id: 'menu', label: { en: 'Our Menu', ar: 'قائمة الطعام' } },
    { id: 'reviews', label: { en: 'Reviews', ar: 'آراء العملاء' } },
    { id: 'about', label: { en: 'About View', ar: 'لمحة عنا' } },
  ];

  const handleLinkClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isRtl = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-brand-black/95 backdrop-blur-md border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <a href="#hero" onClick={() => handleLinkClick('hero')} className="flex items-center gap-2.5 group">
              <div className="bg-[#a82226] p-1.5 sm:p-2 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 select-none relative overflow-hidden shadow-md">
                <div className="absolute -inset-1 bg-gradient-to-tr from-white/10 to-transparent rounded-xl"></div>
                <svg viewBox="0 0 112 45" className="h-8 sm:h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* V - Pizza Slice */}
                  <g fill="#FFFCEB">
                    {/* Pizza Crust */}
                    <rect x="5" y="8" width="30" height="4.5" rx="2" />
                    {/* Pizza Body */}
                    <polygon points="7,14.5 33,14.5 20,39" />
                  </g>
                  {/* Pepperoni holes (colored with background accent color) */}
                  <circle cx="13" cy="20.5" r="2.2" fill="#a82226" />
                  <circle cx="25" cy="22" r="2.8" fill="#a82226" />
                  <circle cx="19.5" cy="29.5" r="2" fill="#a82226" />

                  {/* Letter I */}
                  <rect x="39" y="15.5" width="6.5" height="23.5" rx="1.5" fill="#FFFCEB" />
                  <circle cx="42.25" cy="10" r="3.25" fill="#FFFCEB" />

                  {/* Letter E */}
                  <path 
                    d="M 69,27.25 C 69,20.5 64.5,15.5 58,15.5 C 51.5,15.5 47,20.5 47,27.25 C 47,34 51.5,39 58.5,39 C 64,39 68,35.5 68.5,31 L 62,31 C 61.5,32.5 60.5,33.5 58.5,33.5 C 55,33.5 53.5,31 53.25,28.25 L 69,28.25 C 69,28.1 69,27.5 69,27.25 Z M 53.25,24.5 C 53.5,22 55,19.75 58,19.75 C 61,19.75 62.5,22 62.75,24.5 L 53.25,24.5 Z" 
                    fill="#FFFCEB" 
                  />

                  {/* Letter W */}
                  <path 
                    d="M 72.5,15.5 L 78,35 L 83.5,15.5 H 90 L 95.5,35 L 101,15.5 H 107.5 L 99,39 H 92 L 87,24 L 82,39 H 75 L 66,15.5 Z" 
                    fill="#FFFCEB" 
                  />
                </svg>
              </div>
              <div className={`hidden md:flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
                <span className="text-white font-display font-medium text-sm tracking-widest leading-none">VIEW</span>
                <span className="text-white/40 text-[10px] uppercase font-mono mt-0.5">
                  {lang === 'ar' ? 'رشفة بالنهار، شريحة بالليل' : 'Sip by day, slice by night.'}
                </span>
              </div>
            </a>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label[lang]}
              </button>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/* Direct Phone Link (from photodata: 7750 0020) */}
            <a 
              href="tel:+97477500020" 
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gray text-xs border border-white/10 hover:border-brand-red hover:bg-brand-red/10 text-white transition-all duration-300"
            >
              <Phone className="w-3.5 h-3.5 text-brand-red" />
              <span dir="ltr" className="font-mono font-bold">7750 0020</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gray hover:bg-brand-gray/80 text-white border border-white/5 text-xs font-semibold transition"
              title={lang === 'en' ? 'تحويل للغة العربية' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-brand-yellow" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Profile Button */}
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="p-2.5 rounded-xl bg-brand-gray hover:bg-brand-gray/80 text-white border border-white/5 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red group"
                title={isRtl ? 'حسابي وطلباتي السابقة' : 'My profile & orders'}
              >
                <User className="w-5 h-5 group-hover:text-brand-yellow transition-colors" />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-brand-gray hover:bg-brand-gray/80 text-white border border-white/5 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-brand-yellow transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-brand-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU TOGGLER */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-brand-gray"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-black border-t border-white/10 px-4 py-4 space-y-3 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-right ${isRtl ? 'text-right' : 'text-left'} px-4 py-3 rounded-xl text-base font-medium transition ${
                activeSection === link.id
                  ? 'bg-brand-red text-white'
                  : 'text-gray-300 hover:text-white hover:bg-brand-gray'
              }`}
            >
              {link.label[lang]}
            </button>
          ))}
          <div className="border-t border-white/10 pt-3 flex flex-col gap-2.5">
            {onOpenProfile && (
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-gray text-white text-sm transition border border-white/5 hover:border-brand-yellow font-bold cursor-pointer"
              >
                <User className="w-4 h-4 text-brand-yellow" />
                <span>{isRtl ? 'حسابي وطلباتي السابقة' : 'Profile & Past Orders'}</span>
              </button>
            )}
            <a 
              href="tel:+97477500020" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-gray text-white text-sm transition border border-white/5 hover:border-brand-red"
            >
              <Phone className="w-4 h-4 text-brand-red" />
              <span dir="ltr" className="font-mono font-bold">7750 0020</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
