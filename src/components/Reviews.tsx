import { Star, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../data';
import { motion } from 'motion/react';

interface ReviewsProps {
  lang: 'ar' | 'en';
}

export default function Reviews({ lang }: ReviewsProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="reviews" className="py-20 bg-brand-black scroll-mt-20 border-t border-white/5 relative">
      {/* Decorative red flash lights */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Metric Header Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className={`col-span-1 lg:col-span-4 ${isRtl ? 'lg:text-right text-center' : 'lg:text-left text-center'} space-y-3`}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isRtl ? 'آراء وتجارب غوغل مابس الأكثر تميزاً' : 'Google Reviews Feed'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              {isRtl ? 'كلمات في حق مذاقنا الغني' : 'What Doha Pizza Lovers Say'}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              {isRtl 
                ? 'نفخر بتقييمنا البالغ ٤.٩ والمبني على حب عملائنا الدائم لشرائح وسور الميدنايت ترفل وعسل البيبيروني الحار.'
                : 'Highly praised pizza creations and premium desserts in Doha. Discover verified testimonials from regular visitors.'}
            </p>
          </div>

          {/* Golden Badge Counter */}
          <div className="col-span-1 lg:col-span-8 flex flex-col md:flex-row justify-center items-center gap-6 bg-brand-gray/50 border border-white/5 p-8 rounded-3xl">
            <div className="text-center md:border-r md:border-white/10 md:pr-10 shrink-0">
              <div className="text-6xl font-display font-black text-white leading-none">4.9</div>
              
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-yellow text-brand-yellow" />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-wider">{isRtl ? 'من ٨٤ تقييم معتمد' : 'From 84 Verified Reviews'}</p>
            </div>

            <div className="space-y-3 flex-1 w-full max-w-sm text-xs font-mono text-gray-400">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>{isRtl ? 'جودة طاوة البيتزا والفرن' : 'Pizza Craft & Flavor'}</span>
                  <span className="text-brand-yellow font-bold">5.0 / 5.0</span>
                </div>
                <div className="w-full h-1.5 bg-brand-black rounded-full overflow-hidden">
                  <div className="h-full bg-brand-yellow rounded-full w-full"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>{isRtl ? 'توقيت خدمة السيارات والطلب الكابيني' : 'Drive-Through Speed'}</span>
                  <span className="text-brand-yellow font-bold">4.9 / 5.0</span>
                </div>
                <div className="w-full h-1.5 bg-brand-black rounded-full overflow-hidden">
                  <div className="h-full bg-brand-yellow rounded-full w-[98%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>{isRtl ? 'سيفنيتشر تيراميسو الكادر' : 'Tiramisu Customer Loyalty'}</span>
                  <span className="text-brand-yellow font-bold">4.9 / 5.0</span>
                </div>
                <div className="w-full h-1.5 bg-brand-black rounded-full overflow-hidden">
                  <div className="h-full bg-brand-yellow rounded-full w-[96%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={review.id}
              className="bg-brand-gray/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors group relative overflow-hidden"
            >
              <div>
                {/* Score and source */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-brand-yellow text-brand-yellow" />
                    ))}
                  </div>

                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono font-bold bg-white/5 px-2 py-0.5 rounded-full">
                    {isRtl ? 'تقييم غوغل مابس مالي' : 'Google Certified'}
                  </span>
                </div>

                {/* Body Text */}
                <p className={`text-gray-300 text-sm leading-relaxed mb-6 italic ${isRtl ? 'text-right' : 'text-left'}`}>
                  "{review.text[lang]}"
                </p>
              </div>

              {/* User meta data */}
              <div className={`flex items-center gap-3 border-t border-white/5 pt-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                  src={review.avatar}
                  alt={review.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h4 className="text-white text-xs font-bold truncate">{review.author}</h4>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{review.date[lang]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
