import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Pomodoro Focus Timer",
      description: "Boost productivity with a gamified Pomodoro timer and session tracking.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Gamification & XP",
      description: "Earn XP, level up, and unlock achievements as you stay focused.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Crystal Collection",
      description: "Collect, evolve, and showcase unique digital crystals for every milestone.",
      icon: <IconHeart />,
    },
    {
      title: "Wallet Login (Web3)",
      description: "Secure, privacy-first login with MetaMask and WalletConnect support.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Permanent Progress Logging",
      description: "Store your focus history on Irys for true ownership and transparency.",
      icon: <IconCloud />,
    },
    {
      title: "Offline & PWA Support",
      description: "Track sessions anywhere—offline-first and installable as a PWA.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Future NFT Rewards",
      description: "Unlock rare NFT badges for focus streaks and achievements (coming soon).",
      icon: <IconEaseInOut />,
    },
    {
      title: "Privacy-First Design",
      description: "Your focus data is yours alone—no ads, no tracking, open-source ethos.",
      icon: <IconHelp />,
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} totalFeatures={features.length} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  totalFeatures = 8, // Default value to prevent runtime errors
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  totalFeatures?: number; // Make prop optional with ?
}) => {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-r border-primary/20 dark:border-primary/30 py-8 md:py-10 px-4 md:px-6 relative group/feature transition-colors duration-200 hover:bg-primary/5",
        index % 2 === 0 && "border-r-0",
        index >= totalFeatures - 2 && "border-b-0",
        "lg:border-r lg:border-b-0 lg:border-t-0 lg:first:border-l lg:last:border-r-0"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-3 md:mb-4 relative z-10 text-foreground">
        {icon}
      </div>
      <div className="text-base md:text-lg font-bold mb-1 md:mb-2 relative z-10 pl-3">
        <div className="absolute left-0 top-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-primary/30 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground font-outfit mt-1">
          {title}
        </span>
      </div>
      <p className="text-xs md:text-sm text-foreground max-w-xs relative z-10">
        {description}
      </p>
    </div>
  );
};
