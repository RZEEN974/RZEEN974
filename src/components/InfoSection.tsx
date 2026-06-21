import { MapPin, Phone, Clock, Instagram, Send, Star, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InfoSectionProps {
  lang: 'ar' | 'en';
  onOpenAdmin?: () => void;
}

export default function InfoSection({ lang, onOpenAdmin }: InfoSectionProps) {
  const isRtl = lang === 'ar';

  const scheduleHours = [
    { day: { en: 'Friday', ar: 'الجمعة' }, hours: '1:00 PM - 12:00 AM' },
    { day: { en: 'Saturday', ar: 'السبت' }, hours: '12:00 PM - 12:00 AM' },
    { day: { en: 'Sunday', ar: 'الأحد' }, hours: '12:00 PM - 12:00 AM' },
    { day: { en: 'Monday', ar: 'الاثنين' }, hours: '12:00 PM - 12:00 AM' },
    { day: { en: 'Tuesday', ar: 'الثلاثاء' }, hours: '12:00 PM - 12:00 AM' },
    { day: { en: 'Wednesday', ar: 'الأربعاء' }, hours: '12:00 PM - 12:00 AM' },
    { day: { en: 'Thursday', ar: 'الخميس' }, hours: '12:00 PM - 12:00 AM' },
  ];

  return (
    <section id="about" className="py-20 bg-brand-black/95 scroll-mt-20 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-red/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Responsive Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Info Card */}
          <div className="col-span-1 lg:col-span-6 space-y-8">
            <div className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-brand-red text-xs font-bold uppercase tracking-widest font-mono bg-brand-red/10 px-3 py-1 rounded-full outline-1 outline-brand-red/20 inline-block">
                {isRtl ? 'لمحة ومعلومات التواصل' : 'ABOUT & CONNECTIONS'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
                {isRtl ? 'مطعم فيو بالدوحة - رشفة نهار وشريحة ليل' : 'View Doha - Crafted in Qatar'}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {isRtl 
                  ? 'يقع مطعم "View Pizza" في قلب الدوحة، ويقدم منظوراً جديداً وعصرياً للمذاق الإيطالي والأمريكي الممزوج بعبقرية الحطب والمدخن الصعب. نحن نثق في استخدام المكونات الفاخرة والطازجة كطماطم سان مارزانو، والبوراتا المستوردة بالهواء، ولحم البريسكيت المعتق.'
                  : 'Located in the prime heart of Doha, View Pizza brings a spectacular design-forward and dynamic gourmet woodoven pizza concept. Famous for our slice by day & slice by night, we serve artisanal thick-crust gourmet options, custom mocktails, and fresh desserts.'}
              </p>
            </div>

            {/* Quick Details Deck */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5 text-brand-red" />
                  <span className="font-bold text-sm">{isRtl ? 'العنوان والموقع الجغرافي' : 'Physical Location'}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-relaxed pl-7">
                  9GCG+FV Doha, Qatar<br />
                  {isRtl ? 'منطقة الدحيل / قطر بالقرب من جامعة قطر' : 'Duhail Area / Qatar - Near Qatar University'}
                </p>
                <a 
                  href="https://maps.google.com/?q=9GCG+FV+Doha"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-yellow font-bold hover:underline pl-7"
                >
                  <span>{isRtl ? 'عرض الاتجاهات على غوغل مابس ↗' : 'Get Live Directions ↗'}</span>
                </a>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-5 h-5 text-brand-red" />
                  <span className="font-bold text-sm">{isRtl ? 'الحجوزات وخدمة السيارات' : 'Phone Reserves'}</span>
                </div>
                <div className="text-sm pl-7">
                  <a 
                    href="tel:+97477500020"
                    className="text-white hover:text-brand-yellow transition font-mono leading-relaxed inline-flex items-center gap-1.5"
                  >
                    <span dir="ltr" className="font-bold border-b border-dashed border-white/30 pb-0.5">7750 0020</span>
                    <span className="text-xs text-gray-400 font-sans">({isRtl ? 'الخط الساخن المباشر' : 'Direct Qatari Hotline'})</span>
                  </a>
                </div>
                <a 
                  href="tel:+97477500020"
                  className="inline-flex items-center gap-1 text-xs text-brand-yellow font-bold hover:underline pl-7 animate-pulse"
                >
                  <span>{isRtl ? 'اتصل بنا الآن 📞' : 'Tap to Dial Now 📞'}</span>
                </a>
              </div>
            </div>

            {/* Delivery Portals Buttons */}
            <div className="p-6 bg-brand-gray/40 border border-white/5 rounded-2xl space-y-4">
              <h3 className={`text-white text-sm font-bold flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'منصات شركاء الطلب الخارجي' : 'Verified Delivery Partnerships'}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://www.talabat.com/qatar/view-pizza" 
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-brand-gray hover:bg-brand-gray/80 text-white border border-white/15 text-xs font-bold transition flex items-center justify-between"
                >
                  <span className="text-left font-mono">TALABAT QATAR</span>
                  <span className="text-brand-yellow text-[10px] uppercase font-bold tracking-widest">{isRtl ? 'اطلب الآن ↗' : 'Order now ↗'}</span>
                </a>

                <a
                  href="https://instagram.com" 
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-brand-gray hover:bg-brand-gray/80 text-white border border-white/15 text-xs font-bold transition flex items-center justify-between"
                >
                  <span className="text-left flex items-center gap-1.5 font-mono">
                    <Instagram className="w-4 h-4 text-brand-red" />
                    <span>INSTAGRAM</span>
                  </span>
                  <span className="text-brand-yellow text-[10px] uppercase font-bold tracking-widest">{isRtl ? 'متابعة ↗' : 'Follow us ↗'}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Operating Hours & Mini Map Mock */}
          <div className="col-span-1 lg:col-span-6 bg-brand-gray/20 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="p-3 rounded-2xl bg-brand-red/10 text-brand-red">
                <Clock className="w-5 h-5" />
              </div>
              <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                <h3 className="text-white font-display font-extrabold text-lg">{isRtl ? 'أوقات العمل واستقبال الزبائن' : 'Regular Weekly Schedule'}</h3>
                <p className="text-xs text-gray-500 font-mono">{isRtl ? 'يتم التحديث دورياً لتزامن الإجازات' : 'Updated periodically according to Qatari holidays'}</p>
              </div>
            </div>

            {/* Weekly table */}
            <div className="space-y-2.5 text-xs font-mono">
              {scheduleHours.map((sched, index) => {
                const isToday = index === new Date().getDay(); // simple day match
                return (
                  <div 
                    key={sched.day.en} 
                    className={`flex justify-between items-center py-2.5 px-3 rounded-xl ${
                      isToday ? 'bg-brand-red/10 text-white border border-brand-red/20 font-bold' : 'text-gray-400'
                    }`}
                  >
                    <span className="text-left">{sched.day[lang]}</span>
                    <span className="text-right font-bold text-white">{sched.hours}</span>
                  </div>
                );
              })}
            </div>

            {/* Map Frame Illustration */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-brand-black/80 border border-white/5 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="bg-brand-red text-white p-3 rounded-full animate-bounce shadow-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-white text-xs font-mono font-bold block">9GCG+FV Doha, Qatar</span>
                  <span className="text-gray-500 text-[10px] block mt-1">{isRtl ? 'جلسات جلوس في الداخل • خدمة سيارات • تسليم بدون تلامس' : 'Indoor Dining • Drive-Through • Contactless Delivery'}</span>
                </div>
                <a 
                  href="https://maps.google.com/?q=9GCG+FV+Doha"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-brand-gray border border-white/10 hover:border-brand-yellow font-bold text-[10px] tracking-wider text-white uppercase rounded-xl transition duration-300 shadow-md"
                >
                  {isRtl ? 'فتح في غوغل مابس ↗' : 'Open in Google Maps ↗'}
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Brand footer bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4 text-center">
          <p>© {new Date().getFullYear()} VIEW PIZZA DOHA. {isRtl ? 'كل الحقوق محفوظة.' : 'All Rights Reserved.'}</p>
          <div className="flex items-center gap-4">
            <span>{isRtl ? 'توصيل تالابات في دولة قطر' : 'Talabat Direct Delivery'}</span>
            <span>•</span>
            <a href="tel:+97477500020" className="hover:text-brand-yellow transition inline-flex items-center gap-1">
              <span>{isRtl ? 'هاتف ' : 'Phone '}</span>
              <span dir="ltr" className="font-bold underline">7750 0020</span>
            </a>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button 
                  onClick={onOpenAdmin} 
                  className="hover:text-brand-yellow transition cursor-pointer flex items-center gap-1 focus:outline-none"
                  title={isRtl ? 'لوحة تحكم الطلبات للمطعم' : 'Restaurant Dashboard Portal'}
                >
                  <span className="opacity-80">🔑</span>
                  <span className="font-semibold underline underline-offset-2">{isRtl ? 'بوابة المطعم' : 'Restaurant Portal'}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
