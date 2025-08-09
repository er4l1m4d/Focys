import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all screenshots from the public directory
const slides = [
  { id: 1, src: '/focys-shots/focys screenshot 1.png' },
  { id: 2, src: '/focys-shots/focys screenshot 2.png' },
  { id: 3, src: '/focys-shots/focys screenshot 3.png' },
  { id: 4, src: '/focys-shots/focys screenshot 4.png' },
];

export function AppSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full max-w-[750px] mx-auto">

        {/* Slides */}
        <div className="relative w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              <div className="relative w-full">
                <img
                  src={slides[currentIndex].src}
                  alt={`Focys App Screenshot ${currentIndex + 1}`}
                  className="w-full h-auto max-w-full rounded-xl border-2 border-[#169183] mx-auto block"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


      </div>

      {/* Dots Navigation */}
      <div className="w-full flex justify-center mt-4">
        <div className="backdrop-blur-sm px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/60 shadow-sm flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-[#169183] scale-125' : 'bg-[#169183]/50 scale-100'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
