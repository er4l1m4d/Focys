import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

const navLinks = [
  { id: 'features', label: 'Features' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'faq', label: 'FAQ' },
];

export function LandingNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Account for fixed header
        behavior: 'smooth',
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className='text-sm font-outfit font-medium text-foreground/80 hover:text-[#169183] transition-colors bg-transparent'
          >
            {link.label}
          </button>
        ))}
        <ThemeToggle />
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-foreground/80 hover:text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-16 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-2"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className='w-full text-left px-4 py-2 text-sm font-outfit text-foreground/80 hover:text-[#169183] rounded-md transition-colors bg-transparent hover:bg-transparent'
                  >
                    {link.label}
                  </button>
                ))}
                <div className="h-px bg-border my-1" />
                <div className="px-4 py-2">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
