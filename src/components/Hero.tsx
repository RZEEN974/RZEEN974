import { ArrowRight, Flame, Clock, Car, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  lang: 'ar' | 'en';
  onScrollToMenu: () => void;
}

export default function Hero({ lang, onScrollToMenu }: HeroProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-black pb-12 pt-6">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red/15 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Ambient moving pizza slice particles or soft lights */}
      <div className="absolute top-1/4 left-1/10 w-48 h-48 bg-brand-red/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:py-12">
          
          {/* Hero text representation */}
          <div className={`col-span-1 lg:col-span-7 space-y-6 ${isRtl ? 'lg:text-right text-center order-first lg:order-none' : 'lg:text-left text-center'}`}>
            
            {/* Tagline / status bar */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-gray border border-white/10 text-xs text-white"
            >
              <div className="flex items-center gap-1 text-brand-yellow">
                <Star className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow" />
                <span className="font-bold">4.9</span>
                <span className="text-white/60">(84 {isRtl ? 'تقييم غوغل' : 'Google Reviews'})</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium">{isRtl ? 'مفتوح الآن' : 'Open Now'}</span>
              </div>
              <span className="text-white/20">|</span>
              <span className="text-white/60 font-mono">12:00 PM - 12:00 AM</span>
            </motion.div>

            {/* Core catchy heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1] select-none">
              {isRtl ? (
                <>
                  رشفة بالنهار <br />
                  <span className="text-brand-red decoration-brand-yellow decoration-3 underline underline-offset-8">وشريحة بالليل</span>
                </>
              ) : (
                <>
                  Sip by day, <br />
                  <span className="text-brand-red decoration-brand-yellow decoration-3 underline underline-offset-8">slice by night.</span>
                </>
              )}
            </h1>

            {/* Sub-headline description */}
            <p className="max-w-xl mx-auto lg:mx-0 text-gray-300 text-lg leading-relaxed font-light">
              {isRtl ? (
                'استمتع بألذ شرائح وقطع البيتزا المحضرة بفرن الحطب التقليدي في الدوحة. نتميز ببيتزا بريسكيت مدخنة لمدة ١٢ ساعة، جبنة البوراتا الطازجة، وتيراميسو لا يقاوم.'
              ) : (
                'Doha’s absolute premium pizza experience. Wood-fired crusts, 12-hour slow smoked brisket melt, imported creamy Burrata, and artisanal tiramisu made fresh daily.'
              )}
            </p>

            {/* CTA action buttons */}
            <div className={`flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <button
                onClick={onScrollToMenu}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-bold text-base transition-all duration-300 shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{isRtl ? 'عرض قائمة الطعام' : 'Browse Our Menu'}</span>
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              <a
                href="https://www.talabat.com/qatar/view-pizza"
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-extrabold text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'طلب سريع عبر تالابات' : 'Order via Talabat'}</span>
              </a>
            </div>

            {/* Business Features list */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="p-3 bg-brand-gray/40 border border-white/5 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-red/10 text-brand-red">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-white font-bold">{isRtl ? 'فرن حطب أصلي' : 'Wood Fired'}</h4>
                  <p className="text-[10px] text-gray-400">{isRtl ? 'مكونات إيطالية' : 'San Marzano'}</p>
                </div>
              </div>

              <div className="p-3 bg-brand-gray/40 border border-white/5 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-yellow/10 text-brand-yellow">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-white font-bold">{isRtl ? 'بريسكيت ١٢ ساعة' : '12h Smoked'}</h4>
                  <p className="text-[10px] text-gray-400">{isRtl ? 'لحم تندر ذايب' : 'Melt-in-mouth'}</p>
                </div>
              </div>

              <div className="p-3 bg-brand-gray/40 border border-white/5 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-white font-bold">{isRtl ? 'خدمة السيارة' : 'Drive-Through'}</h4>
                  <p className="text-[10px] text-gray-400">{isRtl ? 'اطلب بداخل سيارتك' : 'Order in your car'}</p>
                </div>
              </div>

              <div className="p-3 bg-brand-gray/40 border border-white/5 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-red/10 text-brand-red">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-white font-bold">{isRtl ? 'تيراميسو متميز' : 'Pure Tiramisu'}</h4>
                  <p className="text-[10px] text-gray-400">{isRtl ? 'بالإسبريسو الفريش' : 'Espresso Handcrafted'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive gorgeous Pizza card display */}
          <div className="col-span-1 lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              
              {/* Dynamic decorative backdrop circles */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-brand-red to-brand-yellow opacity-10 rounded-3xl blur transition duration-500 group-hover:opacity-20"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" 
                alt="View Pizza Oven Speciality" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-3xl transform scale-102 group-hover:scale-105 transition-transform duration-1000"
              />
              
              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-brand-yellow font-mono text-xs font-bold uppercase tracking-widest bg-brand-yellow/10 px-2.5 py-1 rounded-full border border-brand-yellow/20 inline-block mb-1">
                      {isRtl ? 'الأعلى مبيعاً' : 'Best Seller'}
                    </span>
                    <h3 className="text-white text-xl font-display font-extrabold">
                      {isRtl ? 'بريسكيت ملت المميز' : 'Signature Brisket Melt'}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1 max-w-[280px]">
                      {isRtl ? 'لحم بريسكيت مطهو ١٢ ساعة ببطء، صلصة باربكيو وبصل ذهبي مقرمش.' : '12-hour brisket, BBQ reduction and crisp handcut shallots.'}
                    </p>
                  </div>
                  <div className="bg-brand-red text-white p-3.5 rounded-2xl flex flex-col items-center justify-center font-display shadow-lg border border-red-500 transform group-hover:rotate-3 transition-transform">
                    <span className="text-[10px] text-white/70 uppercase leading-none">{isRtl ? 'كاملة' : 'Whole'}</span>
                    <span className="text-xl font-black mt-0.5 leading-none">179</span>
                    <span className="text-[9px] font-bold mt-1 text-brand-yellow font-mono">{isRtl ? 'ر.ق.' : 'QAR'}</span>
                  </div>
                </div>
              </div>

              {/* Pizza slice emblem float */}
              <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white flex items-center gap-1.5">
                <span className="text-brand-red font-bold">✨ {isRtl ? 'شريحة بـ ٢٨ ريال' : 'Slice from 28 QAR'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
