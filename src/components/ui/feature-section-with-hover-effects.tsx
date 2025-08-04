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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground font-outfit">
          {title}
        </span>
      </div>
      <p className="text-sm text-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
