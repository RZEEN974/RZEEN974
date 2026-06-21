import React, { useState } from 'react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data';
import { Plus, Minus, Check, Flame, Star, ShoppingBag, Sparkles, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuProps {
  lang: 'ar' | 'en';
  onAddToCart: (item: CartItem) => void;
}

type SizeType = 'slice' | 'whole' | 'standard';

export default function Menu({ lang, onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<'pizza' | 'sides' | 'drinks' | 'desserts'>('pizza');
  
  // Track selected sizes for pizza items dynamically in individual card state
  // key: itemId, value: 'slice' | 'whole'
  const [pizzaSizes, setPizzaSizes] = useState<Record<string, 'slice' | 'whole'>>({});

  // Customization Modal State
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [modalSize, setModalSize] = useState<'slice' | 'whole' | 'standard'>('slice');
  const [modalOptions, setModalOptions] = useState<{ en: string; ar: string; price: number }[]>([]);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [modalNotes, setModalNotes] = useState<string>('');
  const [showAddSuccess, setShowAddSuccess] = useState<string | null>(null);

  const isRtl = lang === 'ar';

  const categories = [
    { id: 'pizza', name: { en: 'Handcrafted Pizzas', ar: 'البيتزا الفاخرة' } },
    { id: 'sides', name: { en: 'Appetizers & Sides', ar: 'المقبلات والأطباق الجانبية' } },
    { id: 'drinks', name: { en: 'Mojitos, Sip & Sodas', ar: 'المشروبات والموهيتو' } },
    { id: 'desserts', name: { en: 'Sweet Desserts', ar: 'الحلويات المميزة' } },
  ];

  // Filters items by chosen category
  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  const getPizzaSize = (itemId: string) => {
    return pizzaSizes[itemId] || 'slice'; // default is slice
  };

  const togglePizzaSize = (itemId: string, size: 'slice' | 'whole') => {
    setPizzaSizes({
      ...pizzaSizes,
      [itemId]: size,
    });
  };

  // Direct fast-add (uses default settings)
  const handleDirectAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const size: SizeType = item.category === 'pizza' ? getPizzaSize(item.id) : 'standard';
    const price = size === 'slice' 
      ? item.priceSlice! 
      : size === 'whole' 
        ? item.priceWhole! 
        : item.priceStandard!;

    const defaultAdditions = item.options?.filter(opt => opt.default) || [];

    const cartId = `${item.id}-${size}-${defaultAdditions.map(o => o.en).join('_')}`;

    const newCartItem: CartItem = {
      id: cartId,
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      size,
      price,
      quantity: 1,
      selectedOptions: defaultAdditions.map(o => ({ en: o.en, ar: o.ar, price: o.price })),
      notes: ''
    };

    onAddToCart(newCartItem);
    triggerSuccessAnimation(item.name[lang]);
  };

  // Open configuration modal
  const openCustomizationDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    
    const initialSize = item.category === 'pizza' ? getPizzaSize(item.id) : 'standard';
    setModalSize(initialSize);
    
    // Select default options
    const defaults = item.options?.filter(opt => opt.default) || [];
    setModalOptions(defaults.map(opt => ({ en: opt.en, ar: opt.ar, price: opt.price })));
    
    setModalQuantity(1);
    setModalNotes('');
  };

  const toggleModalOption = (opt: { en: string; ar: string; price: number }) => {
    const exists = modalOptions.some(o => o.en === opt.en);
    if (exists) {
      setModalOptions(modalOptions.filter(o => o.en !== opt.en));
    } else {
      setModalOptions([...modalOptions, opt]);
    }
  };

  const handleModalAdd = () => {
    if (!selectedMenuItem) return;

    const priceBase = modalSize === 'slice' 
      ? selectedMenuItem.priceSlice! 
      : modalSize === 'whole' 
        ? selectedMenuItem.priceWhole! 
        : selectedMenuItem.priceStandard!;

    const optionsPrice = modalOptions.reduce((total, opt) => total + opt.price, 0);
    const totalPricePerItem = priceBase + optionsPrice;

    const cartId = `${selectedMenuItem.id}-${modalSize}-${modalOptions.map(o => o.en).sort().join('_')}-${modalNotes ? 'noted' : 'clean'}`;

    const newCartItem: CartItem = {
      id: cartId,
      menuItemId: selectedMenuItem.id,
      name: selectedMenuItem.name,
      image: selectedMenuItem.image,
      size: modalSize,
      price: totalPricePerItem,
      quantity: modalQuantity,
      selectedOptions: modalOptions,
      notes: modalNotes
    };

    onAddToCart(newCartItem);
    setSelectedMenuItem(null);
    triggerSuccessAnimation(selectedMenuItem.name[lang]);
  };

  const triggerSuccessAnimation = (itemName: string) => {
    setShowAddSuccess(itemName);
    setTimeout(() => {
      setShowAddSuccess(null);
    }, 2500);
  };

  return (
    <section id="menu" className="py-20 bg-brand-black/90 scroll-mt-20 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 via-transparent to-brand-red/5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{isRtl ? 'قائمة الطعام الحية' : 'Live Menu Experience'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            {isRtl ? 'اختر وتذوق اللحظة' : 'Sip by Day, Slice by Night'}
          </h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            {isRtl 
              ? 'شرائح بيتزا بقطر كبير بفرن الحجر ومقبلات حارة محضرة بالحب والاهتمام. اضغط على الصنف للتخصيص.' 
              : 'Gigantic wood-fired artisan pizza slices, chilled mocktails, craft dips, and the absolute finest tiramisu.'}
          </p>
        </div>

        {/* Category Toggles Slider */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex bg-brand-gray/80 p-1.5 rounded-2xl border border-white/10 gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 min-w-[90px] text-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/15'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Success Alert Banner */}
        <AnimatePresence>
          {showAddSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm bg-emerald-500 text-brand-black p-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 border border-emerald-400"
            >
              <div className="bg-brand-black text-emerald-400 p-2 rounded-xl">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-black/60">{isRtl ? 'تمت الإضافة بنجاح' : 'Added to Cart!'}</h4>
                <p className="text-sm font-black text-brand-black">{showAddSuccess}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Items */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const hasSizes = item.category === 'pizza';
              const activeSize = hasSizes ? getPizzaSize(item.id) : 'standard';
              const price = activeSize === 'slice' 
                ? item.priceSlice 
                : activeSize === 'whole' 
                  ? item.priceWhole 
                  : item.priceStandard;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  onClick={() => openCustomizationDialog(item)}
                  className="bg-brand-gray/50 rounded-2xl border border-white/5 overflow-hidden hover:border-white/15 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  
                  {/* Card Header & Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Dark gradient mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent"></div>

                    {/* Tags */}
                    {item.tags && (
                      <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex flex-wrap gap-1.5`}>
                        {item.tags.map(tag => (
                          <span key={tag} className="bg-brand-red text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border border-red-400/20 shadow-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Information Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5 mb-2">
                        <h3 className="text-white text-lg font-display font-semibold group-hover:text-brand-red transition-colors">
                          {item.name[lang]}
                        </h3>
                        
                        {/* Static visual price */}
                        <div className="text-right">
                          <span className="text-xl font-mono font-black text-brand-yellow">
                            {price}
                          </span>
                          <span className="text-[10px] text-gray-400 mr-0.5">
                            {isRtl ? 'ر.ق.' : 'QAR'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                        {item.description[lang]}
                      </p>
                    </div>

                    {/* Interactive Sizing Toggles (Special for pizzas) */}
                    <div>
                      {hasSizes && (
                        <div className="flex bg-brand-black/80 rounded-xl p-1 mb-4 border border-white/5 text-xs relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => togglePizzaSize(item.id, 'slice')}
                            className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
                              activeSize === 'slice'
                                ? 'bg-brand-red text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {isRtl ? 'شريحة (٢٨-٢٩ ر.ق)' : 'Slice (28-29 QAR)'}
                          </button>
                          <button
                            onClick={() => togglePizzaSize(item.id, 'whole')}
                            className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
                              activeSize === 'whole'
                                ? 'bg-brand-red text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {isRtl ? 'كاملة (١٣٩-١٧٩ ر.ق)' : 'Whole (139-179 QAR)'}
                          </button>
                        </div>
                      )}

                      {/* Action buttons footer */}
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openCustomizationDialog(item)}
                          className="flex-1 py-3 px-4 rounded-xl bg-brand-gray/80 hover:bg-brand-gray text-white border border-white/10 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>{isRtl ? 'تخصيص الصنف' : 'Add & Customize'}</span>
                        </button>

                        <button
                          onClick={(e) => handleDirectAdd(item, e)}
                          className="px-4 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black transition duration-200 flex items-center justify-center cursor-pointer"
                          title={isRtl ? 'إضافة سريعة بالخيارات الافتراضية' : 'Quick Add with Default Options'}
                        >
                          <ShoppingBag className="w-4 h-4 text-brand-black" />
                        </button>
                      </div>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* CUSTOMIZATION DIALOG MODAL */}
      <AnimatePresence>
        {selectedMenuItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop black overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMenuItem(null)}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative bg-brand-gray border border-white/10 max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh] ${isRtl ? 'text-right' : 'text-left'}`}
            >
              
              {/* Cover Photo */}
              <div className="relative h-48 sm:h-56">
                <img 
                  src={selectedMenuItem.image} 
                  alt={selectedMenuItem.name[lang]} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-gray via-brand-gray/30 to-transparent"></div>
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="absolute top-4 right-4 bg-brand-black/70 hover:bg-brand-black text-white p-2.5 rounded-full border border-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content wrapper */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Title & Desc */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-white flex items-center gap-1.5">
                    {selectedMenuItem.name[lang]}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    {selectedMenuItem.description[lang]}
                  </p>
                </div>

                {/* Sizes Selection (For Pizzas) */}
                {selectedMenuItem.category === 'pizza' && (
                  <div className="space-y-2.5">
                    <label className="text-xs uppercase tracking-wider font-mono text-gray-400 font-bold block">
                      {isRtl ? 'اختر الحجم أو التشكيل' : 'Select Size Variant'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setModalSize('slice')}
                        className={`p-3 rounded-2xl border text-left ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer ${
                          modalSize === 'slice'
                            ? 'bg-brand-red/10 border-brand-red text-white'
                            : 'bg-brand-black/20 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">{isRtl ? 'شريحة بيتزا كبيرة' : 'Gigantic Slice'}</div>
                        <div className="text-xs mt-0.5 text-brand-yellow font-mono">{selectedMenuItem.priceSlice} QAR</div>
                      </button>

                      <button
                        onClick={() => setModalSize('whole')}
                        className={`p-3 rounded-2xl border text-left ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer ${
                          modalSize === 'whole'
                            ? 'bg-brand-red/10 border-brand-red text-white'
                            : 'bg-brand-black/20 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">{isRtl ? 'بيتزا كاملة (٨ قطع)' : 'Whole Pizza (8 slices)'}</div>
                        <div className="text-xs mt-0.5 text-brand-yellow font-mono">{selectedMenuItem.priceWhole} QAR</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Extras Additions Checklist */}
                {selectedMenuItem.options && selectedMenuItem.options.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider font-mono text-gray-400 font-bold block">
                      {isRtl ? 'إضافات وخيارات إضافية' : 'Enhance Your Slice / Pizza'}
                    </label>
                    <div className="space-y-2">
                      {selectedMenuItem.options.map((opt) => {
                        const isChecked = modalOptions.some(o => o.en === opt.en);
                        return (
                          <button
                            key={opt.en}
                            onClick={() => toggleModalOption(opt)}
                            className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition ${
                              isChecked
                                ? 'bg-white/5 border-white/20 text-white'
                                : 'bg-transparent border-white/5 text-gray-400 hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border ${
                                isChecked ? 'bg-brand-red border-brand-red' : 'border-gray-500'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span>{lang === 'ar' ? opt.ar : opt.en}</span>
                            </div>
                            <span className="font-mono text-brand-yellow">
                              {opt.price === 0 ? (isRtl ? 'مجاناً' : 'Free') : `+${opt.price} QAR`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional notes box */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-mono text-gray-400 font-bold block">
                    {isRtl ? 'ملاحظات خاصة للتحضير' : 'Special Prep Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder={isRtl ? 'مثال: بدون بصل، صوص إضافي، درجة سوا مقرمشة...' : 'e.g. Extra hot, no onions, crispier crust...'}
                    className="w-full p-3.5 rounded-xl bg-brand-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-red placeholder-gray-500 resize-none"
                  />
                </div>

                {/* Quantity and dynamic price calculators */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="space-y-0.5">
                    <span className="text-xs text-gray-400">{isRtl ? 'الكمية الفرعية' : 'Select Quantity'}</span>
                    <div className="flex items-center gap-1 bg-brand-black/40 rounded-xl p-1 border border-white/5">
                      <button
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-mono font-bold text-white text-sm">{modalQuantity}</span>
                      <button
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className={`${isRtl ? 'text-left' : 'text-right'}`}>
                    <span className="text-xs text-gray-400">{isRtl ? 'الإجمالي الكلي لهذا الصنف' : 'Item Grand Total'}</span>
                    <div className="text-2xl font-mono font-black text-brand-yellow">
                      {((modalSize === 'slice' 
                        ? selectedMenuItem.priceSlice! 
                        : modalSize === 'whole' 
                          ? selectedMenuItem.priceWhole! 
                          : selectedMenuItem.priceStandard!) 
                       + modalOptions.reduce((acc, current) => acc + current.price, 0)) * modalQuantity}
                      <span className="text-xs text-gray-400 font-normal mr-1">{isRtl ? 'ر.ق.' : 'QAR'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 bg-brand-black/40 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="flex-1 py-3.5 bg-brand-gray/50 hover:bg-brand-gray text-white border border-white/10 text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleModalAdd}
                  className="flex-2 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs sm:text-sm font-black rounded-2xl transition shadow-lg shadow-brand-red/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>{isRtl ? 'إضافة إلى السلة' : 'Add to Orders Basket'}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
