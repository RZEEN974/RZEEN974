import { motion } from 'motion/react';

export default function GourmetBackgroundEmojis() {
  const emojis = [
    // Left side scattered
    { char: '🍕', top: '10%', left: '3%', size: 'text-4xl md:text-6xl', rotate: '15deg', delay: 0 },
    { char: '🍅', top: '25%', left: '7%', size: 'text-2xl md:text-4xl', rotate: '-10deg', delay: 1.5 },
    { char: '🌱', top: '42%', left: '2%', size: 'text-xl md:text-3xl', rotate: '25deg', delay: 0.5 },
    { char: '🧀', top: '60%', left: '8%', size: 'text-3xl md:text-5xl', rotate: '-35deg', delay: 2 },
    { char: '🔥', top: '78%', left: '4%', size: 'text-3xl md:text-5xl', rotate: '5deg', delay: 1 },
    { char: '🍕', top: '92%', left: '6%', size: 'text-4xl md:text-6xl', rotate: '-15deg', delay: 3 },

    // Right side scattered
    { char: '🥤', top: '12%', right: '4%', size: 'text-4xl md:text-6xl', rotate: '-15deg', delay: 0.8 },
    { char: '🌶️', top: '28%', right: '8%', size: 'text-3xl md:text-4.5xl', rotate: '45deg', delay: 2.5 },
    { char: '🍕', top: '48%', right: '3%', size: 'text-4.5xl md:text-7xl', rotate: '12deg', delay: 0.3 },
    { char: '🥖', top: '68%', right: '7%', size: 'text-2.5xl md:text-4.5xl', rotate: '-20deg', delay: 1.2 },
    { char: '🧂', top: '85%', right: '4%', size: 'text-2xl md:text-4.5xl', rotate: '30deg', delay: 1.8 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {emojis.map((emoji, index) => {
        const position = {
          top: emoji.top,
          ...(emoji.left ? { left: emoji.left } : { right: emoji.right })
        };

        return (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              ...position,
              transform: `rotate(${emoji.rotate})`,
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: [0.03, 0.09, 0.03],
              y: [0, -10, 0],
              rotate: [`0deg`, emoji.rotate, `0deg`]
            }}
            transition={{
              duration: 8 + (index % 4) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: emoji.delay
            }}
            className={`${emoji.size} active:scale-125 transition-all duration-300 transform-gpu filter blur-[0.5px]`}
          >
            {emoji.char}
          </motion.div>
        );
      })}
    </div>
  );
}
