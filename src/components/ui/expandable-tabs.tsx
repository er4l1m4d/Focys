"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";

// Remove the custom type as Framer Motion provides its own types

interface Tab {
  title: string;
  icon?: LucideIcon;
  customComponent?: React.ReactNode;
  preventExpand?: boolean;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  customComponent?: never;
  preventExpand?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
    width: "auto",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
    width: isSelected ? "auto" : "2.5rem", // Fixed width when collapsed
  }),
};

import type { Variants } from 'framer-motion';

const spanVariants: Variants = {
  hidden: { 
    width: 0, 
    opacity: 0, 
    marginLeft: 0,
    transition: { duration: 0.2 }
  },
  visible: { 
    width: "auto", 
    opacity: 1,
    marginLeft: "0.5rem",
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const transition = { 
  type: "spring",
  bounce: 0,
  duration: 0.6,
  delay: 0.1
} as const;

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(0);
  const outsideClickRef = React.useRef<HTMLDivElement>(null);
  
  // Keep track of the current path to maintain selection on page changes
  useEffect(() => {
    const updateActiveTab = () => {
      const path = window.location.pathname.toLowerCase();
      
      // Get all non-separator tabs
      const nonSeparatorTabs = tabs.filter(tab => tab.type !== 'separator');
      
      // Find the tab that matches the current path
      const activeTab = nonSeparatorTabs.find(tab => {
        if (!tab.title) return false;
        // Special case for Focus Timer since its route is /timer
        if (tab.title === 'Focus Timer') {
          return path === '/timer' || path.startsWith('/timer/');
        }
        // For other tabs, convert title to path (lowercase, replace spaces)
        const tabPath = `/${tab.title.toLowerCase().replace(' ', '')}`;
        return path === tabPath || path.startsWith(tabPath + '/');
      });
      
      // If we found a matching tab, get its index in the original tabs array
      if (activeTab) {
        const tabIndex = tabs.findIndex(tab => tab === activeTab);
        setSelected(tabIndex);
      } else {
        // No matching tab found, collapse all
        setSelected(null);
      }
    };

    // Initial check
    updateActiveTab();
    
    // Listen for route changes
    const handleRouteChange = () => {
      updateActiveTab();
    };
    
    // Set up a MutationObserver to detect route changes in a SPA
    const observer = new MutationObserver(handleRouteChange);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [tabs]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-6 w-px bg-border/50" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 p-1",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        // If there's a custom component, render it directly
        if (tab.customComponent) {
          return (
            <div key={tab.title} className="flex items-center">
              {tab.customComponent}
            </div>
          );
        }

        // Otherwise, render the standard tab with icon and title
        const Icon = tab.icon;
        if (!Icon) return null;

        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl py-2 text-sm font-outfit font-medium transition-all duration-200 bg-transparent overflow-hidden",
              selected === index
                ? cn("font-semibold hover:bg-[#169183]/10 min-w-[140px] text-[#169183] dark:text-[#169183]", activeColor)
                : "text-muted-foreground hover:text-[#169183] dark:hover:text-[#169183] hover:bg-[#169183]/5 dark:hover:bg-[#169183]/5 w-10"
            )}
            style={{
              minWidth: selected === index ? '140px' : '2.5rem', // Fixed width for both states
            }}
          >
            <div className="flex items-center min-w-[24px]">
              <Icon size={20} className="flex-shrink-0" />
            </div>
            <AnimatePresence initial={false}>
              <motion.span
                variants={spanVariants}
                initial="hidden"
                animate={selected === index ? "visible" : "hidden"}
                className="whitespace-nowrap overflow-hidden"
              >
                {tab.title}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
