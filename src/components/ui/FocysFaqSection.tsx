"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FocysFaqSectionProps {
  title?: string;
  items?: FaqItem[];
  className?: string;
}

const focysFaqItems: FaqItem[] = [
  {
    question: "What is Focys and how does it work?",
    answer:
      "Focys is a gamified focus tracker that uses the Pomodoro technique to help you stay productive. You start a timer, complete focus sessions, and earn XP, crystals, and achievements as you go. All your progress is stored locally and can be permanently logged to Web3 (Irys) if you connect your wallet.",
  },
  {
    question: "How does Focys use Web3 and my wallet?",
    answer:
      "Focys allows you to connect your Ethereum wallet (MetaMask, WalletConnect, etc.) to create a profile, collect unique crystals, and permanently log your session data using Irys. Your productivity achievements can be tied to your wallet for future NFT rewards.",
  },
  {
    question: "Is my focus and productivity data private?",
    answer:
      "Yes! By default, all your session data is stored locally on your device. You can choose to upload your session history to Irys for permanent, decentralized storage—this is always optional and under your control. Focys never shares your data with third parties.",
  },
  {
    question: "What are crystals and how do I earn them?",
    answer:
      "Crystals are collectible rewards you earn by completing focus sessions, leveling up, and reaching productivity milestones. Some crystals can evolve or be upgraded as you progress. Future updates will allow you to mint special crystals as NFTs!",
  },
  {
    question: "Can I use Focys offline or on mobile?",
    answer:
      "Yes! Focys is a Progressive Web App (PWA), so you can install it on your device and use it offline. All core features work without an internet connection, and your data will sync when you're back online.",
  },
  {
    question: "How do I customize my focus sessions?",
    answer:
      "You can choose from preset Pomodoro intervals or customize your session and break lengths in the timer settings. More focus modes (like Flow and Challenge) are coming soon!",
  },
  {
    question: "What are the future plans for Focys?",
    answer:
      "Upcoming features include advanced analytics, session streaks, shareable Proof of Focus, and unique NFT achievement badges. Check the roadmap for details!",
  },
];

const FocysFaqSection: React.FC<FocysFaqSectionProps> = ({
  title = "Frequently Asked Questions",
  items = focysFaqItems,
  className,
  ...props
}) => {
  const [openIndex, setOpenIndex] = React.useState<number>(-1);
  return (
    <section
      className={cn(
        "w-full py-16 px-4 bg-background",
        className
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[#169183] mb-4 font-outfit">
            {title}
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <FaqAccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FaqAccordionItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onClick: () => void;
}

const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({ question, answer, index, isOpen, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "rounded-xl border border-border bg-card transition-all duration-300",
        isOpen ? "shadow-md" : "hover:shadow-sm"
      )}
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl dark:bg-[#202120]"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <h3 className="text-lg font-semibold text-[#202120] dark:text-white font-outfit">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground dark:text-[#169183]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.4, ease: "easeOut" }, opacity: { duration: 0.3, delay: 0.1 } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.2 } } }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-foreground dark:text-white leading-relaxed font-inter"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FocysFaqSection;
