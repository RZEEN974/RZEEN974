import { useState, useEffect, useRef, FormEvent } from 'react';
import { Phone, Check, RefreshCw, LogOut, ShieldAlert, Award, Clock, DollarSign, ClipboardCheck, Play, BellRing, Trash2, Ban } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderType: 'dine-in' | 'pickup' | 'delivery';
  tableNumber?: string;
  carPlateNumber?: string;
  deliveryAddress?: string;
  paymentMethod: string;
  notes?: string;
  items: any[];
  grandTotal: number;
  createdAt: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

interface DashboardProps {
  lang: 'ar' | 'en';
  onClose: () => void;
}

export default function RestaurantDashboard({ lang, onClose }: DashboardProps) {
  const isRtl = lang === 'ar';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(5);

  const previousOrderIds = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Authenticate with PIN 7750
  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin === '7750') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  // Fetch orders from API
  const fetchOrders = async (isFirstLoad = false) => {
    if (isFirstLoad) setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        
        // Check for new orders to play sound
        if (previousOrderIds.current.size > 0) {
          const hasNewPending = data.some(
            order => !previousOrderIds.current.has(order.id) && order.status === 'pending'
          );
          if (hasNewPending && audioEnabled) {
            playNotificationSound();
          }
        }
        
        // Update references
        previousOrderIds.current = new Set(data.map(o => o.id));
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  };

  // Initialize and request audio context
  const enableAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
        setAudioEnabled(true);
        // Play a quick friendly synth chime to confirm activation
        playNotificationChime(440, 0.1);
        setTimeout(() => playNotificationChime(554.37, 0.15), 100);
      }
    } catch (e) {
      console.error('Audio initialization blocked or unsupported', e);
    }
  };

  // Synthetic bell sound generator
  const playNotificationChime = (frequency: number, duration: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  };

  const playNotificationSound = () => {
    // Elegant high pitch dual chime (Ding-Dong!)
    playNotificationChime(523.25, 0.3); // C5
    setTimeout(() => {
      playNotificationChime(659.25, 0.4); // E5
    }, 150);
  };

  // Status modifier
  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Optimistic state change
        setOrders(prev =>
          prev.map(o => (o.id === id ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Delete/Archive order
  const deleteOrder = async (id: string) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من أرشفة/حذف هذا الطلب؟' : 'Are you sure you want to remove this order?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error('Order archive error:', err);
    }
  };

  // Clear all
  const resetAllOrders = async () => {
    if (!window.confirm(isRtl ? 'تحذير: هل تود مسح أو تصفير جميع الطلبات بالكامل؟' : 'Warning: Wipe out all orders from server memory?')) return;
    try {
      const res = await fetch('/api/orders/reset', { method: 'POST' });
      if (res.ok) {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-refresh interval (5s)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchOrders(true);

    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          fetchOrders();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  // Calculations for stats
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  
  const totalEarnings = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  // Authentication page
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-brand-black z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,34,38,0.12)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="w-full max-w-md bg-brand-gray/90 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 bg-brand-red/10 border border-brand-red rounded-full flex items-center justify-center mx-auto text-brand-red">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-display font-black text-white">
              {isRtl ? 'بوابة إدارة المطبخ والطلبات' : 'Kitchen Management Portal'}
            </h2>
            <p className="text-xs text-gray-400">
              {isRtl ? 'برجاء إدخال الرمز السري للوصول إلى لوحة طلبات فيو الدوحة' : 'Secure authentication to view live incoming order flows.'}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 tracking-wider font-mono font-bold uppercase block text-center">
                {isRtl ? 'الرقم السري للموظفين (كود الهاتف: 7750)' : 'Restaurant PIN (Hint: 7750)'}
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className={`w-full tracking-[1.5em] text-center p-4 text-2xl font-mono rounded-xl bg-brand-black/60 border ${
                  pinError ? 'border-brand-red' : 'border-white/10'
                } text-white focus:outline-none focus:border-brand-yellow`}
                autoFocus
              />
              {pinError && (
                <p className="text-center text-xs text-brand-red font-bold mt-1">
                  ❌ {isRtl ? 'الرمز السري غير صحيح. حاول مجدداً.' : 'Incorrect PIN. Try again.'}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-semibold cursor-pointer"
              >
                {isRtl ? 'رجوع للمتجر' : 'Back to Store'}
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black transition shadow-lg shadow-brand-red/10 cursor-pointer"
              >
                {isRtl ? 'تأكيد الدخول الآمن' : 'Authorize Entrance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Active Dashboard page
  return (
    <div className="fixed inset-0 bg-brand-black z-50 overflow-y-auto flex flex-col justify-between" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Header */}
      <header className="bg-brand-gray border-b border-white/5 py-4 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
                <span>VIEW PIZZA DOHA</span>
                <span className="text-xs bg-brand-red px-2 py-0.5 rounded text-white font-sans font-bold">
                  {isRtl ? 'المطبخ المباشر 👨‍🍳' : 'KITCHEN LAB 👨‍🍳'}
                </span>
              </h1>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {isRtl 
                  ? `توزيع وتلقي شبكيّ فوري. التحديث التلقائي خلال ${refreshCountdown} ثوانٍ...` 
                  : `Real-time incoming client streams. Refreshing in ${refreshCountdown}s...`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Audio bell actuator */}
            {!audioEnabled ? (
              <button
                onClick={enableAudio}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500 text-amber-400 text-xs font-bold animate-pulse hover:bg-amber-500/20 transition cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تفعيل جرس المطبخ 🔔' : 'Turn On Chimes 🔔'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الجرس الصوتي مُمكَّن 🔊' : 'Audio Chime Enabled 🔊'}</span>
              </div>
            )}

            {/* Quick manual refresh */}
            <button
              onClick={() => fetchOrders()}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
              title={isRtl ? 'تحديث يدوي سريع' : 'Manual Refresh'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Reset memory */}
            <button
              onClick={resetAllOrders}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer text-xs flex items-center gap-1.5"
              title={isRtl ? 'تصفير كافة الطلبات' : 'Reset Orders'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'تصفير' : 'Reset'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isRtl ? 'الرجوع للمتجر' : 'Exits Admin'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          
          <div className="bg-brand-gray border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red shrink-0">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-mono">{isRtl ? 'جديد معلق' : 'Pending'}</span>
              <span className="text-xl font-mono text-white font-black">{pendingCount}</span>
            </div>
          </div>

          <div className="bg-brand-gray border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shrink-0">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-mono">{isRtl ? 'قيد التحضير' : 'Cooking'}</span>
              <span className="text-xl font-mono text-white font-black">{preparingCount}</span>
            </div>
          </div>

          <div className="bg-brand-gray border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
              <Check className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-mono">{isRtl ? 'جاهز للاستلام / التوصيل' : 'Ready'}</span>
              <span className="text-xl font-mono text-white font-black">{readyCount}</span>
            </div>
          </div>

          <div className="bg-brand-gray border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-mono">{isRtl ? 'تم تسليمها' : 'Completed'}</span>
              <span className="text-xl font-mono text-white font-black">{completedCount}</span>
            </div>
          </div>

          <div className="bg-brand-gray border border-white/5 rounded-2xl p-4 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="w-10 h-10 bg-emerald-400/15 rounded-full flex items-center justify-center text-brand-yellow shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-mono">{isRtl ? 'أرباح اليوم المكتملة' : 'Revenue Today'}</span>
              <span className="text-lg font-mono text-brand-yellow font-black">{totalEarnings} <span className="text-[10px] text-white/50">{isRtl ? 'ر.ق' : 'QAR'}</span></span>
            </div>
          </div>

        </div>

        {/* Filters Selectors Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
          {[
            { id: 'all', label: isRtl ? 'كل الطلبيات' : 'All Streams', count: orders.length },
            { id: 'pending', label: isRtl ? 'قيد الانتظار 🔴' : 'New Pending 🔴', count: pendingCount },
            { id: 'preparing', label: isRtl ? 'يتم تحضيرها 👨‍🍳' : 'Preparing 👨‍🍳', count: preparingCount },
            { id: 'ready', label: isRtl ? 'جاهزة للتسليم 📦' : 'Ready 📦', count: readyCount },
            { id: 'completed', label: isRtl ? 'مكتملة ومغلقة ✅' : 'Completed ✅', count: completedCount },
            { id: 'cancelled', label: isRtl ? 'ملغية ❌' : 'Cancelled ❌', count: orders.filter(o => o.status === 'cancelled').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-gray text-gray-400 border border-white/5 hover:border-white/10 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 ml-1 text-[10px] rounded-full bg-brand-black/40 text-white font-mono">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Loader list states */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-brand-yellow mx-auto animate-spin" />
            <p className="text-gray-400 text-sm font-mono">{isRtl ? 'جاري الاتصال السريع وتحديث الطلبات...' : 'Connecting to View Doha Orders Stream...'}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-24 text-center bg-brand-gray/30 rounded-2xl border border-dashed border-white/5 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">{isRtl ? 'لا يوجد أي طلبات في هذا القسم' : 'No records found for this category'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {isRtl ? 'أي طلبات يقوم العملاء بإرسالها ستظهر هنا فورياً وبشكل مباشر!' : 'Live customer orders will arrive here instantly.'}
              </p>
            </div>
          </div>
        ) : (
          /* Active orders grid container */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className={`p-6 rounded-2xl bg-brand-gray border shadow-xl flex flex-col justify-between transition-all duration-300 ${
                  order.status === 'pending'
                    ? 'border-brand-red/40 bg-[radial-gradient(ellipse_at_top_right,rgba(168,34,38,0.15)_0%,transparent_60%)]'
                    : order.status === 'preparing'
                    ? 'border-amber-500/20 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.05)_0%,transparent_60%)]'
                    : order.status === 'ready'
                    ? 'border-emerald-500/20 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05)_0%,transparent_60%)]'
                    : 'border-white/5 bg-brand-gray/50'
                }`}
              >
                <div>
                  
                  {/* Order header row */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-4.5 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-black text-brand-yellow select-all">{order.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          order.orderType === 'dine-in' 
                            ? 'bg-amber-500/10 text-amber-400' 
                            : order.orderType === 'pickup' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : 'bg-pink-500/10 text-pink-400'
                        }`}>
                          {order.orderType === 'dine-in' ? (isRtl ? 'داخل الصالة 🪑' : 'Dine-In 🪑') : 
                           order.orderType === 'pickup' ? (isRtl ? 'استلام سيارة 🚗' : 'Drive-Thru 🚗') : 
                           (isRtl ? 'توصيل قطر 📍' : 'Qatar Delivery 📍')}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span>{new Date(order.createdAt).toLocaleTimeString(isRtl ? 'ar' : 'en', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString(isRtl ? 'ar' : 'en', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Order visual status badge */}
                    <div className="text-right">
                      <span className={`text-xs font-black font-mono tracking-wide uppercase px-3 py-1.5 rounded-lg border inline-block ${
                        order.status === 'pending'
                          ? 'bg-brand-red/10 border-brand-red text-white animate-pulse'
                          : order.status === 'preparing'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : order.status === 'ready'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : order.status === 'completed'
                          ? 'bg-white/5 border-white/10 text-gray-400'
                          : 'bg-transparent border-red-500/20 text-red-400'
                      }`}>
                        {order.status === 'pending' ? (isRtl ? 'طلب جديد ⚠️' : 'New Pending ⚠️') :
                         order.status === 'preparing' ? (isRtl ? 'جاري التحضير 🍳' : 'Preparing 🍳') :
                         order.status === 'ready' ? (isRtl ? 'جاهز للتسليم 📦' : 'Ready 📦') :
                         order.status === 'completed' ? (isRtl ? 'تم التسليم والمصادقة' : 'Completed') :
                         (isRtl ? 'ملغي' : 'Cancelled')}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information Cards */}
                  <div className="p-3 bg-brand-black/35 rounded-xl border border-white/5 mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isRtl ? 'اسم العميل الموقر' : 'Customer Name'}:</span>
                      <strong className="text-white">{order.customerName}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{isRtl ? 'رقم الاتصال المباشر' : 'Customer Phone'}:</span>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-brand-yellow font-mono hover:underline font-bold inline-flex items-center gap-1 active:scale-95 transition"
                      >
                        <Phone className="w-3 h-3 text-brand-red" />
                        <span dir="ltr">{order.phone}</span>
                      </a>
                    </div>

                    {order.orderType === 'dine-in' && order.tableNumber && (
                      <div className="flex justify-between bg-amber-500/5 p-1 rounded">
                        <span className="text-amber-400 font-bold">{isRtl ? 'رقم الطاولة الصالحة' : 'Dining Table Number'}:</span>
                        <strong className="text-amber-400 font-mono font-black">{order.tableNumber}</strong>
                      </div>
                    )}

                    {order.orderType === 'pickup' && order.carPlateNumber && (
                      <div className="flex justify-between bg-blue-500/5 p-1.5 rounded flex-wrap gap-2">
                        <span className="text-blue-400 font-bold">{isRtl ? 'بيانات وحراشف السيارة' : 'Driver Car Description'}:</span>
                        <strong className="text-blue-200 select-all font-semibold">{order.carPlateNumber}</strong>
                      </div>
                    )}

                    {order.orderType === 'delivery' && order.deliveryAddress && (
                      <div className="bg-pink-500/5 p-2 rounded block space-y-1">
                        <div className="text-pink-400 font-bold">{isRtl ? 'العنوان الجغرافي بالدوحة' : 'Delivery Destination'}:</div>
                        <p className="text-gray-300 leading-normal select-all select-text font-sans">{order.deliveryAddress}</p>
                      </div>
                    )}

                    {order.paymentMethod && (
                      <div className="flex justify-between font-mono text-[10px] text-gray-500 border-t border-white/5 pt-1.5">
                        <span>{isRtl ? 'نظام الدفع المختار' : 'Payment Framework'}:</span>
                        <span className="text-white/80">{order.paymentMethod === 'cash_card_on_delivery' ? (isRtl ? 'نقدًا / بطاقة بالموقع' : 'Cash/Card on Spot') : (isRtl ? 'إلكتروني تالابات' : 'Talabat Gateway')}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items Table Card */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase font-bold">{isRtl ? 'تفاصيل المأكولات والمشروبات' : 'Seleted Food Provisions'}</span>
                    <div className="bg-brand-black/10 rounded-xl border border-white/5 divide-y divide-white/5">
                      {order.items.map((item, idx) => {
                        const sizeLabel = item.size === 'slice' ? (isRtl ? 'شريحة' : 'Slice') : item.size === 'whole' ? (isRtl ? 'كاملة' : 'Whole') : (isRtl ? 'عادي' : 'Standard');
                        return (
                          <div key={idx} className="p-3 text-xs flex justify-between gap-4 items-start">
                            <div className="space-y-0.5">
                              <span className="text-white font-bold block">{item.name[lang] || item.name.en}</span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-brand-yellow font-mono text-[10px] uppercase">({sizeLabel})</span>
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                  <span className="text-gray-400 text-[10px]">
                                    + {item.selectedOptions.map((o: any) => o[lang] || o.en).join(', ')}
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <p className="text-[10px] text-amber-400/80 italic font-sans mt-1">
                                  "{item.notes}"
                                </p>
                              )}
                            </div>
                            <div className="text-right font-mono text-white shrink-0">
                              <span>x{item.quantity}</span>
                              <span className="text-gray-500 text-[10px] block font-normal">{(item.price * item.quantity)} QAR</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kitchen Special Notes */}
                  {order.notes && (
                    <div className="mt-4 p-2.5 bg-brand-black/20 rounded-xl border border-amber-500/10 text-xs flex gap-2 items-start text-amber-300">
                      <span className="font-bold underline shrink-0">{isRtl ? 'تعليمات العميل' : 'Alert'}:</span>
                      <p className="italic font-sans">"{order.notes}"</p>
                    </div>
                  )}

                </div>

                {/* Status action buttons row */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-gray-500">{isRtl ? 'إجمالي الدفع' : 'GRAND PORTION'}:</span>
                    <strong className="text-brand-yellow font-mono text-lg font-black">{order.grandTotal} QAR</strong>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 justify-end">
                    
                    {/* Move to preparing */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-brand-black text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>{isRtl ? 'تأكيد وتحضير 🍳' : 'Prep Order 🍳'}</span>
                      </button>
                    )}

                    {/* Move to ready */}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-brand-black text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>{isRtl ? 'جاهز للتسليم 📦' : 'Mark Ready 📦'}</span>
                      </button>
                    )}

                    {/* Move to completed */}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer animate-pulse"
                      >
                        <span>{isRtl ? 'تم الاستلام والتسليم 🎯' : 'Delivered 🎯'}</span>
                      </button>
                    )}

                    {/* Cancel status toggle */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition cursor-pointer text-xs"
                        title={isRtl ? 'إلغاء الطلب' : 'Cancel order'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete entry completely */}
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition cursor-pointer text-xs"
                      title={isRtl ? 'أرشفة السجل من القائمة' : 'Archive records'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Admin footer info */}
      <footer className="bg-brand-black/40 border-t border-white/5 py-5 text-center text-[10px] text-gray-500 font-mono mt-12">
        <p>VIEW DOHA INTEGRATED NETWORK SERVER RUNNING SAFE | PORT 3000 INGRESS | LOCAL HOST NODEJS READY</p>
      </footer>

    </div>
  );
}
