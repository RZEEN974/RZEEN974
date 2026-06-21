import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, History, Save, MapPin, Phone, Car, Compass, RotateCcw, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem } from '../types';

interface UserProfileModalProps {
  lang: 'ar' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onReorder: (items: CartItem[]) => void;
  onOpenCart: () => void;
}

interface UserProfile {
  customerName: string;
  phone: string;
  carPlateNumber: string;
  deliveryAddress: string;
}

interface HistoricalOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  orderType: string;
  tableNumber?: string;
  carPlateNumber?: string;
  deliveryAddress?: string;
  paymentMethod: string;
  notes?: string;
  items: CartItem[];
  grandTotal: number;
}

export default function UserProfileModal({
  lang,
  isOpen,
  onClose,
  onReorder,
  onOpenCart
}: UserProfileModalProps) {
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');
  
  // Profile Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [carPlateNumber, setCarPlateNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Past Orders States
  const [pastOrders, setPastOrders] = useState<HistoricalOrder[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Reload history and profile when open
  useEffect(() => {
    if (!isOpen) return;

    // Load Profile
    try {
      const savedProfile = localStorage.getItem('view_pizza_profile');
      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        setCustomerName(profile.customerName || '');
        setPhone(profile.phone || '');
        setCarPlateNumber(profile.carPlateNumber || '');
        setDeliveryAddress(profile.deliveryAddress || '');
      }
    } catch (e) {
      console.error(e);
    }

    // Load Past Orders
    try {
      const savedOrders = localStorage.getItem('view_pizza_past_orders');
      if (savedOrders) {
        setPastOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  // Save profile to local storage
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    try {
      const profile: UserProfile = {
        customerName,
        phone,
        carPlateNumber,
        deliveryAddress
      };
      localStorage.setItem('view_pizza_profile', JSON.stringify(profile));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle order expansion
  const toggleOrderExpand = (id: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Re-add order items to cart
  const handleReorderClick = (items: CartItem[]) => {
    onReorder(items);
    onClose();
    onOpenCart();
  };

  // Format date nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(isRtl ? 'ar-QA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`w-full max-w-2xl bg-brand-gray/95 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md max-h-[90vh] flex flex-col`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Ambient Red glow background effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-yellow/5 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-white">
                    {isRtl ? 'حساب العميل والطلبات' : 'Client Profile & Orders'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isRtl ? 'إدارة تفاصيل الملف وتتبع تاريخ الطلبيات المخزنة' : 'Manage your saved coordinates and track offline local sessions'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switches */}
            <div className="flex border-b border-white/5 px-6 shrink-0 bg-brand-black/25 relative z-10">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-4 font-bold text-xs uppercase tracking-wider transition-all duration-200 border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-brand-red text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4 text-brand-red" />
                <span>{isRtl ? 'طلباتي السابقة' : 'Previous Orders'}</span>
                {pastOrders.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-red text-white text-[9px] font-mono font-black select-none">
                    {pastOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3.5 px-4 font-bold text-xs uppercase tracking-wider transition-all duration-200 border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-brand-yellow text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 text-brand-yellow" />
                <span>{isRtl ? 'ملف العميل الشخصي' : 'Customer Info'}</span>
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 relative z-10">
              
              {/* TAB 1: PREVIOUS ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {pastOrders.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-brand-black/25 rounded-2xl border border-dashed border-white/5 space-y-4">
                      <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
                        <History className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">
                          {isRtl ? 'تاريخ طلباتك فارغ حالياً' : 'No Order History Yet'}
                        </h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                          {isRtl 
                            ? 'لم يتم العثور على أي طلبيات محلية سابقة. قم بإجراء طلب من قسم السلة وسيتم تدوينه وحفظه هنا فورا!' 
                            : 'Any local orders you place on this device will automatically show up here as a secure, fast log!'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4.5">
                      {pastOrders.map((order) => {
                        const isExpanded = !!expandedOrders[order.id];
                        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

                        return (
                          <div
                            key={order.id}
                            className={`rounded-xl bg-brand-black/40 border border-white/5 overflow-hidden transition-all duration-200 hover:border-white/10`}
                          >
                            {/* Collapse Header clickable */}
                            <div
                              onClick={() => toggleOrderExpand(order.id)}
                              className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-white/5 transition"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-sm text-brand-yellow">{order.id}</span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    order.orderType === 'dine-in' 
                                      ? 'bg-amber-500/10 text-amber-400' 
                                      : order.orderType === 'pickup' 
                                      ? 'bg-blue-500/10 text-blue-400' 
                                      : 'bg-pink-500/10 text-pink-400'
                                  }`}>
                                    {order.orderType === 'dine-in' ? (isRtl ? 'داخل الصالة' : 'Dine-In') : 
                                     order.orderType === 'pickup' ? (isRtl ? 'سيارة / تيك-أواي' : 'Drive-thru') : 
                                     (isRtl ? 'توصيل' : 'Delivery')}
                                  </span>
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono">
                                  {formatDate(order.createdAt)}
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-right">
                                  <span className="text-[10px] text-gray-500 block">{isRtl ? 'الإجمالي الكلي' : 'Grand Total'}</span>
                                  <span className="font-mono text-emerald-400 font-black text-sm">{order.grandTotal} QAR</span>
                                </div>
                                <div className="p-1 text-gray-500 bg-white/5 rounded-md hover:text-white">
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </div>
                              </div>
                            </div>

                            {/* Collapse Panel items & details */}
                            {isExpanded && (
                              <div className="px-4.5 pb-4.5 border-t border-white/5 bg-brand-black/20 space-y-4 text-xs">
                                
                                {/* Items Listing */}
                                <div className="space-y-2 pt-3">
                                  <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 font-bold block">
                                    {isRtl ? 'المأكولات والمشروبات بالملف' : 'Item details'}
                                  </div>
                                  <div className="bg-brand-black/60 rounded-lg overflow-hidden divide-y divide-white/5 border border-white/5">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="p-3 flex justify-between gap-4 items-center">
                                        <div>
                                          <span className="text-white font-bold block">
                                            {item.name[lang] || item.name.en}
                                          </span>
                                          <span className="text-brand-yellow font-mono text-[10px] uppercase">
                                            ({item.size === 'slice' ? (isRtl ? 'شريحة' : 'Slice') : (isRtl ? 'كاملة' : 'Whole')})
                                          </span>
                                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                                            <span className="text-[10px] text-gray-400 block mt-0.5">
                                              + {item.selectedOptions.map((o: any) => o[lang] || o.en).join(', ')}
                                            </span>
                                          )}
                                        </div>
                                        <div className="font-mono font-bold text-white">
                                          x{item.quantity}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Delivery / Pickup Coordinate logs */}
                                <div className="p-3 rounded-lg bg-brand-gray/50 border border-white/5 space-y-1 text-[11px] text-gray-400">
                                  {order.customerName && (
                                    <div className="flex justify-between">
                                      <span>{isRtl ? 'اسم المستلم:' : 'Receiver:'}</span>
                                      <span className="text-white font-semibold">{order.customerName}</span>
                                    </div>
                                  )}
                                  {order.phone && (
                                    <div className="flex justify-between">
                                      <span>{isRtl ? 'الجوال:' : 'Phone phone:'}</span>
                                      <span className="text-white font-mono">{order.phone}</span>
                                    </div>
                                  )}
                                  {order.orderType === 'dine-in' && order.tableNumber && (
                                    <div className="flex justify-between">
                                      <span>{isRtl ? 'طاولة الصالة:' : 'Table number:'}</span>
                                      <span className="text-amber-400 font-bold">{order.tableNumber}</span>
                                    </div>
                                  )}
                                  {order.orderType === 'pickup' && order.carPlateNumber && (
                                    <div className="flex justify-between">
                                      <span>{isRtl ? 'لوحة / وصف السيارة:' : 'Car plate/details:'}</span>
                                      <span className="text-blue-400 font-bold">{order.carPlateNumber}</span>
                                    </div>
                                  )}
                                  {order.orderType === 'delivery' && order.deliveryAddress && (
                                    <div className="flex justify-between flex-col sm:flex-row gap-1 border-t border-white/5 pt-1 mt-1">
                                      <span>{isRtl ? 'العنوان الجغرافي بالدوحة:' : 'Address address:'}</span>
                                      <span className="text-pink-300 font-sans leading-relaxed block text-right">{order.deliveryAddress}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Reorder Button Trigger */}
                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={() => handleReorderClick(order.items)}
                                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black transition cursor-pointer shadow-md active:scale-95 duration-150"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{isRtl ? 'طلب نفس الأصناف مجدداً 🍕' : 'Order This Again 🍕'}</span>
                                  </button>
                                </div>

                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFILE/ADDRESS SAVER */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="bg-brand-black/25 p-4.5 rounded-xl border border-white/5 space-y-1.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5 text-brand-yellow" />
                      <span>{isRtl ? 'تفاصيل السكن والتسليم السريع' : 'Fast Coordinates & Autofill'}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {isRtl 
                        ? 'حفظ هذه الخيارات يساعدك على تعبئة بيانات السلة والطلب بشكل فوري للمرات القادمة بلمسة واحدة.'
                        : 'Filling these registers coordinates will automatically pre-populate client fields inside checkout next times!'}
                    </p>
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 font-bold uppercase block">
                      {isRtl ? 'اسمك الموقر' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isRtl ? "مثال: رامي الكواري" : "e.g. Rami Al-Kuwari"}
                      className="w-full text-xs p-3.5 rounded-xl bg-brand-black/60 border border-white/10 text-white focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 font-bold uppercase block">
                      {isRtl ? 'رقم الاتصال (قطري)' : 'Phone Contact Number'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500 font-mono text-xs">
                        +974
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="7750 0020"
                        className="w-full text-xs p-3.5 pl-14 rounded-xl bg-brand-black/60 border border-white/10 text-white focus:outline-none focus:border-brand-yellow font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Car Details */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-gray-400 font-bold uppercase block flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isRtl ? 'بيانات سيارتك للشركة' : 'Your Car Coordinates'}</span>
                      </label>
                      <input
                        type="text"
                        value={carPlateNumber}
                        onChange={(e) => setCarPlateNumber(e.target.value)}
                        placeholder={isRtl ? "ر ق ١٢٣٤ - لاندكروزر بيضاء" : "e.g. Black Patrol - 1234"}
                        className="w-full text-xs p-3.5 rounded-xl bg-brand-black/60 border border-white/10 text-white focus:outline-none focus:border-brand-yellow"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-gray-400 font-bold uppercase block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        <span>{isRtl ? 'العنوان الافتراضي بالدوحة' : 'Doha Default Address'}</span>
                      </label>
                      <textarea
                        rows={1}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={isRtl ? "مثال: برج الفردان، شقة ٢٢٠٤ الدفنة" : "e.g. Tower 2, Flat 12, West Bay, Doha"}
                        className="w-full text-xs p-3.5 rounded-xl bg-brand-black/60 border border-white/10 text-white focus:outline-none focus:border-brand-yellow resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    {saveSuccess ? (
                      <span className="text-emerald-400 text-xs font-bold font-sans flex items-center gap-1.5 animate-bounce">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{isRtl ? 'تم حفظ التعديلات بنجاح ! ✨' : 'Profile updated successfully! ✨'}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[10px]">
                        {isRtl ? 'تفاصيلك آمنة ومحفوظة في جهازك الخاص' : 'All coordinates stored safely under local sandbox'}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-brand-yellow text-brand-black text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95 duration-150"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isRtl ? 'حفظ البيانات بمحرك المتصفح' : 'Save Details Local'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Modal Footer warning */}
            <div className="p-4 bg-brand-black/50 border-t border-white/5 text-center text-[9px] text-gray-500 font-mono tracking-widest uppercase shrink-0">
              {isRtl ? 'فيو بيتزا الدوحة المطبخ الحقيقي المتكامل' : 'VIEW PIZZA DOHA SECURED CUSTOMER CONTEXT ENGINE'}
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
