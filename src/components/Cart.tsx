import { CartItem, OrderType, CheckoutDetails } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, CreditCard, ChevronRight, CheckCircle2, Car, MapPin, Coffee, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CartProps {
  lang: 'ar' | 'en';
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function Cart({
  lang,
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  const isRtl = lang === 'ar';
  
  // Checkout process steps
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [tableNumber, setTableNumber] = useState('');
  const [carPlateNumber, setCarPlateNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_card_on_delivery' | 'online_talabat'>('cash_card_on_delivery');

  // Input validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 10 : 0;
  const grandTotal = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = isRtl ? 'الاسم مطلوب' : 'Name is required';
    }
    if (!phone.trim()) {
      newErrors.phone = isRtl ? 'رقم الهاتف مطلوب' : 'Phone is required';
    } else if (!/^\+?\d{8,14}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = isRtl ? 'أدخل رقم هاتف صحيح (مثال: 77500020)' : 'Enter valid phone (e.g. 77500020)';
    }

    if (orderType === 'dine-in' && !tableNumber.trim()) {
      newErrors.tableNumber = isRtl ? 'رقم الطاولة مطلوب للخدمة' : 'Table number is required';
    }
    if (orderType === 'withdrawal' || (orderType === 'pickup' && !carPlateNumber.trim())) {
      // Friendly plate request for drive-through
      newErrors.carPlateNumber = isRtl ? 'بيانات أو لون السيارة مطلوب للخدمة' : 'Car plate/color is required for Drive-Through';
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = isRtl ? 'عنوان التوصيل في الدوحة مطلوب' : 'Delivery address in Doha is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Compile Order Slip text for WhatsApp template
  const generateWhatsAppMessage = () => {
    let text = `🍕 *VIEW PIZZA DOHA - NEW ORDER* 🍕\n`;
    text += `=========================\n`;
    text += `👤 *Customer:* ${customerName}\n`;
    text += `📞 *Phone:* ${phone}\n`;
    text += `🏷️ *Service:* ${orderType.toUpperCase()}\n`;
    
    if (orderType === 'dine-in') {
      text += `🪑 *Table Number:* ${tableNumber}\n`;
    } else if (orderType === 'pickup') {
      text += `🚗 *Car Details & Plate:* ${carPlateNumber}\n`;
    } else if (orderType === 'delivery') {
      text += `📍 *Delivery Address:* ${deliveryAddress}\n`;
    }
    
    text += `💰 *Payment:* ${paymentMethod === 'cash_card_on_delivery' ? 'Cash/Card on pickup' : 'Redirection to Talabat'}\n`;
    if (notes.trim()) {
      text += `📝 *Notes:* ${notes}\n`;
    }
    text += `=========================\n`;
    text += `🛍️ *ORDER SELECTIONS:*\n`;

    cartItems.forEach((item) => {
      const sizeLabel = item.size === 'slice' ? 'Slice' : item.size === 'whole' ? 'Whole (8 Pcs)' : 'Standard';
      text += `• *${item.name.en}* (${sizeLabel}) x${item.quantity} - ${item.price * item.quantity} QAR\n`;
      if (item.selectedOptions.length > 0) {
        text += `  _Extras: ${item.selectedOptions.map(o => o.en).join(', ')}_\n`;
      }
      if (item.notes) {
        text += `  _Note: "${item.notes}"_\n`;
      }
    });

    text += `=========================\n`;
    text += `📊 *Subtotal:* ${subtotal} QAR\n`;
    if (deliveryFee > 0) {
      text += `🚚 *Delivery Fee:* ${deliveryFee} QAR\n`;
    }
    text += `💵 *GRAND TOTAL:* ${grandTotal} QAR\n`;
    text += `=========================\n`;
    text += `✨ Sent from View Pizza Doha Applet ✨`;

    return encodeURIComponent(text);
  };

  // Load profile when checkout opens or on mounting state
  useState(() => {
    try {
      const savedProfile = localStorage.getItem('view_pizza_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.customerName) setCustomerName(profile.customerName);
        if (profile.phone) setPhone(profile.phone);
        if (profile.carPlateNumber) setCarPlateNumber(profile.carPlateNumber);
        if (profile.deliveryAddress) setDeliveryAddress(profile.deliveryAddress);
      }
    } catch (e) {
      console.error('Failed to load profile for checkout', e);
    }
  });

  const saveToLocalStoragePastOrders = (orderId: string, payload: any) => {
    try {
      const historical = localStorage.getItem('view_pizza_past_orders');
      const pastOrders = historical ? JSON.parse(historical) : [];
      const newHistoryItem = {
        id: orderId,
        createdAt: new Date().toISOString(),
        ...payload
      };
      localStorage.setItem('view_pizza_past_orders', JSON.stringify([newHistoryItem, ...pastOrders]));
      
      const profile = {
        customerName: payload.customerName,
        phone: payload.phone,
        carPlateNumber: payload.carPlateNumber,
        deliveryAddress: payload.deliveryAddress,
      };
      localStorage.setItem('view_pizza_profile', JSON.stringify(profile));
    } catch (err) {
      console.error('Error saving past order history:', err);
    }
  };

  const handleSubmitOrder = async (type: 'simulate' | 'whatsapp') => {
    if (!validateForm()) return;

    // Prepare structure to post to backend restaurant API
    const orderPayload = {
      customerName,
      phone,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      carPlateNumber: (orderType === 'pickup' || orderType === 'withdrawal') ? carPlateNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      paymentMethod,
      notes: notes.trim() ? notes : undefined,
      items: cartItems.map(item => ({
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        notes: item.notes
      })),
      grandTotal
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        
        saveToLocalStoragePastOrders(savedOrder.id, orderPayload);

        if (type === 'whatsapp') {
          const waUrl = `https://wa.me/97477500020?text=${generateWhatsAppMessage()}`;
          window.open(waUrl, '_blank');
        }

        setOrderPlacedSuccess(savedOrder.id);
        onClearCart();
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Backend API unavailable. Falling back to local offline simulation.', err);
      
      const randomID = `VIEW-${Math.floor(1000 + Math.random() * 9000)}`;
      saveToLocalStoragePastOrders(randomID, orderPayload);

      if (type === 'whatsapp') {
        const waUrl = `https://wa.me/97477500020?text=${generateWhatsAppMessage()}`;
        window.open(waUrl, '_blank');
      }
      setOrderPlacedSuccess(randomID);
      onClearCart();
    }
  };

  const handleCloseSuccess = () => {
    setOrderPlacedSuccess(null);
    setIsCheckoutOpen(false);
    onClose();
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-xs"
          ></motion.div>

          <div className={`absolute inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-brand-gray border-l border-white/10 shadow-2xl flex flex-col justify-between h-full"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-brand-black/30">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-red animate-pulse" />
                  <h2 className="text-xl font-display font-black text-white">
                    {isRtl ? 'سلة الطلبات' : 'Your Selections'}
                  </h2>
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full font-mono">
                    {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SUCCESS MODAL EMBEDDED */}
              {orderPlacedSuccess ? (
                <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-5">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black text-white">
                      {isRtl ? 'رائع! تم إعداد طلبك' : 'Order Configured!'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {isRtl 
                        ? 'شكراً لاختيارك مطعم فيو الدوحة. تم تسجيل طلبك بنجاح وسنقوم بالتواصل معك لتأكيده.' 
                        : 'Thank you for choosing View Restaurant Doha. Your order coordinates was successfully structured.'}
                    </p>
                  </div>

                  <div className="bg-brand-black/60 p-4 rounded-xl border border-white/5 w-full text-center">
                    <span className="text-gray-400 text-xs block uppercase font-mono tracking-wider">{isRtl ? 'رقم الكود التعريفي للطلب' : 'Order Reference ID'}</span>
                    <span className="text-xl font-mono text-brand-yellow font-black mt-1 inline-block">{orderPlacedSuccess}</span>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {isRtl ? 'تلميح: إذا قمت بمشاركة الطلب عبر واتساب، سيصل الفريق تفاصيل سيارتك أو طاولتك فوراً.' : 'Tip: Sharing via WhatsApp sends your car details or table number directly.'}
                    </p>
                  </div>

                  <div className="w-full space-y-2 pt-4">
                    <button
                      onClick={() => {
                        const waUrl = `https://wa.me/97477500020?text=${generateWhatsAppMessage()}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isRtl ? 'إرسال مباشر عبر واتساب (٧٧٥٠٠٠٢٠)' : 'Direct Share to WhatsApp'}</span>
                    </button>
                    <button
                      onClick={handleCloseSuccess}
                      className="w-full py-3 px-4 rounded-xl bg-brand-gray border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
                    >
                      {isRtl ? 'الرجوع ومتابعة المتصفح' : 'Close & Continue Browsing'}
                    </button>
                  </div>
                </div>
              ) : !isCheckoutOpen ? (
                /* CART SELECTIONS VIEW */
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isCartEmpty ? (
                      <div className="text-center py-20 space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-base">{isRtl ? 'سلة مشترياتك فارغة حالياً' : 'Your cart is looking light'}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {isRtl ? 'تصفح قائمة الطعام الغنية بالبيتزا والحلويات الرائعة واملأ سلتك.' : 'Browse our fine pizza collection and add premium portions.'}
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="px-5 py-2.5 bg-brand-red text-white font-bold text-xs rounded-xl hover:bg-brand-red-hover transition"
                        >
                          {isRtl ? 'تصفح الأصناف الآن' : 'Add Slices Now'}
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl bg-brand-black/30 border border-white/5 flex gap-4 items-center justify-between"
                        >
                          <img
                            src={item.image}
                            alt={item.name[lang]}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                          <div className="flex-1 text-left min-w-0">
                            <h4 className="text-white text-sm font-semibold truncate">
                              {item.name[lang]}
                            </h4>
                            <p className="text-brand-yellow font-mono text-xs font-bold mt-0.5">
                              {item.price} QAR 
                              <span className="text-white/40 text-[10px] font-normal mx-1 uppercase">
                                ({item.size === 'slice' ? (isRtl ? 'شريحة' : 'Slice') : item.size === 'whole' ? (isRtl ? 'كاملة' : 'Whole') : (isRtl ? 'عادي' : 'Std')})
                              </span>
                            </p>

                            {/* Option tags */}
                            {item.selectedOptions.length > 0 && (
                              <p className="text-[10px] text-gray-400 mt-1 leading-snug line-clamp-1">
                                + {item.selectedOptions.map(o => lang === 'ar' ? o.ar : o.en).join(', ')}
                              </p>
                            )}

                            {/* Chef notes */}
                            {item.notes && (
                              <p className="text-[10px] bg-brand-black/8 w-fit text-brand-yellow border border-yellow-500/10 px-1.5 py-0.5 rounded mt-1 font-sans italic">
                                "{item.notes}"
                              </p>
                            )}
                          </div>

                          {/* Control Quantity buttons */}
                          <div className="flex flex-col items-center gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1 bg-brand-black/50 p-1 rounded-lg border border-white/5 scale-90">
                              <button
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-mono text-white text-xs font-black">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-gray-500 hover:text-brand-red p-1 transition cursor-pointer"
                              title={isRtl ? 'حذف الصنف من السلة' : 'Remove item'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Calculations and button checkout trigger footer */}
                  {!isCartEmpty && (
                    <div className="p-6 bg-brand-black/40 border-t border-white/5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                          <span className="font-mono text-white">{subtotal} QAR</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{isRtl ? 'رسوم الخدمة' : 'Service & Setup Fee'}</span>
                          <span className="text-emerald-400 font-bold uppercase text-[10px]">{isRtl ? 'مجاني' : 'Free'}</span>
                        </div>
                        <div className="border-t border-white/5 my-2"></div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold text-white">{isRtl ? 'المجموع النهائي' : 'GRAND TOTAL'}</span>
                          <div className="text-2xl font-mono font-black text-brand-yellow">
                            {grandTotal} <span className="text-xs text-white/55 font-normal">{isRtl ? 'ر.ق.' : 'QAR'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full py-4 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl transition shadow-lg shadow-brand-red/15 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{isRtl ? 'التوجه لتسجيل بيانات الطلب' : 'Configure Checkout Details'}</span>
                        <ChevronRight className={`w-4.5 h-4.5 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* CHECKOUT DETAILS VIEW */
                <div className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Back to selections link */}
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="text-xs text-brand-yellow flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>← {isRtl ? 'الرجوع لسلة المأكولات' : 'Back to Item Selections'}</span>
                    </button>

                    <h3 className="text-lg font-display font-black text-white">
                      {isRtl ? 'تفاصيل طلبك الفاخر' : 'Place Your Order Details'}
                    </h3>

                    {/* Order Type Toggle buttons */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'نوع الخدمة المفضلة' : 'Select Service Type'}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setOrderType('pickup')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                            orderType === 'pickup'
                              ? 'bg-brand-red/10 border-brand-red text-white'
                              : 'bg-brand-black/20 border-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          <Car className="w-4 h-4" />
                          <span>{isRtl ? 'استلام سيارة' : 'Drive-Thru'}</span>
                        </button>

                        <button
                          onClick={() => setOrderType('dine-in')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                            orderType === 'dine-in'
                              ? 'bg-brand-red/10 border-brand-red text-white'
                              : 'bg-brand-black/20 border-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          <Coffee className="w-4 h-4" />
                          <span>{isRtl ? 'المطعم بالداخل' : 'Dine-In'}</span>
                        </button>

                        <button
                          onClick={() => setOrderType('delivery')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                            orderType === 'delivery'
                              ? 'bg-brand-red/10 border-brand-red text-white'
                              : 'bg-brand-black/20 border-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                          <span>{isRtl ? 'توصيل قطر' : 'Delivery'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'اسم العميل الموقر' : 'Your Noble Name'}</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isRtl ? 'مثال: عبد الرحمن آل ثاني' : 'e.g. Abdulrahman Al-Thani'}
                        className={`w-full p-3 rounded-xl bg-brand-black/50 border text-sm text-white focus:outline-none focus:border-brand-red ${
                          errors.customerName ? 'border-brand-red' : 'border-white/10'
                        }`}
                      />
                      {errors.customerName && <p className="text-[10px] text-brand-red font-semibold">{errors.customerName}</p>}
                    </div>

                    {/* Customer Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'رقم جوال الدوحة للاتصال والمطالبة' : 'Doha Connection Mobile'}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="7750 0020"
                        className={`w-full p-3 rounded-xl bg-brand-black/50 border text-sm text-white focus:outline-none focus:border-brand-red ${
                          errors.phone ? 'border-brand-red' : 'border-white/10'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] text-brand-red font-semibold">{errors.phone}</p>}
                    </div>

                    {/* Conditional inputs */}
                    {orderType === 'dine-in' && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'رقم طاولة الصالة' : 'Table Number / Lounge Code'}</label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder={isRtl ? 'مثال: طاولة رقم ٤ بالداخل' : 'e.g. Table #4'}
                          className={`w-full p-3 rounded-xl bg-brand-black/50 border text-sm text-white focus:outline-none focus:border-brand-red ${
                            errors.tableNumber ? 'border-brand-red' : 'border-white/10'
                          }`}
                        />
                        {errors.tableNumber && <p className="text-[10px] text-brand-red font-semibold">{errors.tableNumber}</p>}
                      </div>
                    )}

                    {orderType === 'pickup' && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'رقم لوحة السيارة، لونها ونوعها' : 'Car Spec / Plate Number & Color'}</label>
                        <input
                          type="text"
                          value={carPlateNumber}
                          onChange={(e) => setCarPlateNumber(e.target.value)}
                          placeholder={isRtl ? 'رقم اللوحة ٤٥٦٢١ - سيارة لاندكروزر بيضاء' : 'White Land Cruiser - Plate 45621'}
                          className={`w-full p-3 rounded-xl bg-brand-black/50 border text-sm text-white focus:outline-none focus:border-brand-red ${
                            errors.carPlateNumber ? 'border-brand-red' : 'border-white/10'
                          }`}
                        />
                        {errors.carPlateNumber && <p className="text-[10px] text-brand-red font-semibold">{errors.carPlateNumber}</p>}
                      </div>
                    )}

                    {orderType === 'delivery' && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'عنوان التوصيل الشامل بالدوحة' : 'Delivery Address Specifications'}</label>
                        <textarea
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder={isRtl ? 'مثال: الدفنة، شارع لوسيل، مبنى ٤٢، شقة ١٢...' : 'e.g. Dafna area, Lusail St, Building 42, Apt 12...'}
                          className={`w-full p-3 rounded-xl bg-brand-black/50 border text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red resize-none ${
                            errors.deliveryAddress ? 'border-brand-red' : 'border-white/10'
                          }`}
                        />
                        {errors.deliveryAddress && <p className="text-[10px] text-brand-red font-semibold">{errors.deliveryAddress}</p>}
                      </div>
                    )}

                    {/* Payment Method toggle */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'طريقة الدفع المريحة' : 'Payment Framework'}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPaymentMethod('cash_card_on_delivery')}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                            paymentMethod === 'cash_card_on_delivery'
                              ? 'bg-white/10 border-white/30 text-white'
                              : 'bg-transparent border-white/5 text-gray-400'
                          }`}
                        >
                          {isRtl ? 'نقدًا / بطاقة عند الاستلام' : 'Cash / Card on Delivery'}
                        </button>
                        <a
                          href="https://www.talabat.com/qatar/view-pizza"
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          onClick={() => setPaymentMethod('online_talabat')}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition text-center flex items-center justify-center ${
                            paymentMethod === 'online_talabat'
                              ? 'bg-brand-red/10 border-brand-red text-white'
                              : 'bg-transparent border-white/5 text-gray-400'
                          }`}
                        >
                          {isRtl ? 'طلب تالابات أونلاين ↗' : 'Online Talabat ↗'}
                        </a>
                      </div>
                    </div>

                    {/* Extra Comments */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-mono tracking-wider uppercase font-bold">{isRtl ? 'تعليمات لربان المطبخ والفرن' : 'Order Prep Instructions'}</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={isRtl ? 'مثال: رتب الطبق بشكل جميل...' : 'e.g. Ensure we have napkins...'}
                        className="w-full p-3 rounded-xl bg-brand-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>

                  {/* Calculations and submit action section */}
                  <div className="space-y-3.5 pt-6 border-t border-white/10">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>{isRtl ? 'المجموع الأساسي' : 'Items Price'}</span>
                        <span className="font-mono text-white">{subtotal} QAR</span>
                      </div>
                      {orderType === 'delivery' && (
                        <div className="flex justify-between text-gray-400 animate-fade-in">
                          <span>{isRtl ? 'رسوم توصيل الدوحة' : 'Doha Delivery Fee'}</span>
                          <span className="font-mono text-white">{deliveryFee} QAR</span>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline font-bold text-sm text-white pt-1">
                        <span>{isRtl ? 'صافي المجموع الكلي' : 'TOTAL OUTFLOW'}</span>
                        <div className="text-xl font-mono text-brand-yellow font-black">
                          {grandTotal} <span className="text-xs font-normal">QAR</span>
                        </div>
                      </div>
                    </div>

                    {/* Place Order direct with simulated ID OR WhatsApp draft */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSubmitOrder('simulate')}
                        className="w-full py-3.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black text-sm font-black transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5 text-brand-black" />
                        <span>{isRtl ? 'تأكيد وحجز الطلب محلياً' : 'Confirm & Register Order'}</span>
                      </button>

                      <button
                        onClick={() => handleSubmitOrder('whatsapp')}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4.5 h-4.5" />
                        <span>{isRtl ? 'إرسال الطلب عبر واتساب الكابتن' : 'Format & Send to WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
