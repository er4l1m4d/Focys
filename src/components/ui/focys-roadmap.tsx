"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Circle, ArrowRight, Calendar, Timer, Gem, Trophy, Smartphone, Zap, Rocket } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  quarter: string;
  progress: number;
  tasks: string[];
  category?: string;
  date?: string;
}

interface RoadmapProps {
  items?: RoadmapItem[];
  className?: string;
}

const focysRoadmapData: RoadmapItem[] = [
  {
    id: "1",
    title: "Foundation & Core Timer",
    description: "Built the fundamental Pomodoro timer with session tracking and basic gamification features",
    status: "completed",
    quarter: "Phase 0-3",
    progress: 100,
    category: "Core",
    date: "Completed",
    tasks: [
      "Vite + React project setup with TailwindCSS",
      "Pomodoro timer with 25/5 minute intervals",
      "Session logging and localStorage persistence",
      "XP system, levels, and achievement unlocks",
    ],
  },
  {
    id: "2", 
    title: "Web3 Integration & Profiles",
    description: "Wallet connection, user profiles, and crystal collection system with permanent data storage",
    status: "completed",
    quarter: "Phase 4-6",
    progress: 100,
    category: "Web3",
    date: "Completed",
    tasks: [
      "MetaMask wallet integration and profiles",
      "Crystal evolution system with Data Shards",
      "Irys permanent session data storage",
      "Landing page and navigation polish",
    ],
  },
  {
    id: "3",
    title: "UI Polish & Mobile Experience", 
    description: "Enhanced mobile responsiveness, theme system, and visual consistency across all pages",
    status: "in-progress",
    quarter: "Phase 7",
    progress: 85,
    category: "UX",
    date: "In Progress",
    tasks: [
      "Dark/light theme toggle with persistence",
      "Mobile-optimized layouts for all pages", 
      "Brand color consistency (#169183 teal)",
      "Typography and accessibility improvements",
    ],
  },
  {
    id: "4",
    title: "Advanced Focus Features",
    description: "Multiple focus modes, session analytics, and advanced productivity tracking features",
    status: "upcoming",
    quarter: "Phase 8",
    progress: 0,
    category: "Features",
    date: "Next Up",
    tasks: [
      "Focus Modes: Pomodoro, Flow, Challenge",
      "Session tagging (study, deep work, etc.)",
      "Analytics: XP charts, heatmaps, streaks",
      "Level-based feature unlocks",
    ],
  },
  {
    id: "5",
    title: "PWA & Offline Support",
    description: "Progressive Web App features with offline timer support and app installation",
    status: "upcoming", 
    quarter: "Phase 9",
    progress: 0,
    category: "PWA",
    date: "Coming Soon",
    tasks: [
      "Offline timer functionality with sync",
      "Service worker and app caching",
      "PWA manifest for app installation",
      "Fullscreen app experience",
    ],
  },
  {
    id: "6",
    title: "Web3 Enhancements",
    description: "NFT badges, gamified features, and blockchain-powered productivity rewards",
    status: "upcoming",
    quarter: "Post-MVP",
    progress: 0,
    category: "Blockchain",
    date: "Future",
    tasks: [
      "Irys-powered NFT achievement badges",
      "Session Contracts (immutable goals)",
      "Daily Proof of Focus Cards (shareable)",
      "Distraction Monster virtual pet system",
    ],
  },
];

const getStatusConfig = (status: RoadmapItem["status"]) => {
  const configs = {
    completed: {
      color: "text-[#169183]",
      bgColor: "bg-[#169183]/10",
      borderColor: "border-[#169183]/20",
      progressColor: "bg-[#169183]",
      icon: CheckCircle2,
    },
    "in-progress": {
      color: "text-[#169183]",
      bgColor: "bg-[#169183]/10",
      borderColor: "border-[#169183]/30",
      progressColor: "bg-[#169183]",
      icon: Clock,
    },
    upcoming: {
      color: "text-muted-foreground",
      bgColor: "bg-muted/30",
      borderColor: "border-muted",
      progressColor: "bg-muted-foreground",
      icon: Circle,
    },
  };
  return configs[status];
};

const getCategoryIcon = (category?: string) => {
  const icons = {
    Core: Timer,
    Web3: Gem,
    UX: Smartphone,
    Features: Trophy,
    PWA: Zap,
    Blockchain: Rocket,
  };
  return icons[category as keyof typeof icons] || Circle;
};

function FocysRoadmap({ items = focysRoadmapData, className }: RoadmapProps) {
  return (
    <div className={cn("w-full max-w-6xl mx-auto px-4 py-16", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4" style={{ color: '#169183' }}>
          Development Roadmap
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Track our journey building the ultimate gamified focus tracker. From core timer functionality 
          to Web3 integration and beyond—see what's completed, in progress, and coming next.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
        
        <motion.div
          className="absolute left-6 top-0 w-0.5 origin-top hidden md:block"
          style={{ backgroundColor: '#169183' }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <div className="space-y-8">
          {items.map((item, index) => {
            const config = getStatusConfig(item.status);
            const IconComponent = config.icon;
            const CategoryIcon = getCategoryIcon(item.category);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div 
                  className="absolute left-6 top-6 w-3 h-3 rounded-full bg-background border-2 z-10 transform -translate-x-1/2 hidden md:block"
                  style={{ borderColor: '#169183' }}
                />

                <Card className={cn(
                  "ml-0 md:ml-16 transition-all duration-300 hover:shadow-lg",
                  "bg-card/80 backdrop-blur-sm border",
                  config.borderColor
                )}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", config.bgColor)}>
                              <CategoryIcon className={cn("w-5 h-5", config.color)} />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold font-outfit text-foreground mb-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{item.date || item.quarter}</span>
                                {item.category && (
                                  <>
                                    <span>•</span>
                                    <span>{item.category}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Badge className={cn("flex items-center gap-1", config.bgColor, config.color)}>
                            <IconComponent className="w-3 h-3" />
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("-", " ")}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Progress value={item.progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                              {item.progress}%
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.tasks.map((task, taskIndex) => (
                              <motion.div
                                key={taskIndex}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: taskIndex * 0.05 + index * 0.1 + 0.3 }}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: '#169183' }} />
                                <span>{task}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* End marker */}
        <motion.div
          className="absolute left-6 -bottom-4 w-3 h-3 rounded-full transform -translate-x-1/2 hidden md:block"
          style={{ backgroundColor: '#169183' }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: items.length * 0.1 + 0.5, type: "spring" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: items.length * 0.1 + 0.7 }}
        className="text-center mt-12 p-6 bg-muted/50 rounded-lg"
      >
        <h3 className="text-lg font-semibold font-outfit text-foreground mb-2">Join Our Journey</h3>
        <p className="text-muted-foreground">
          Connect your wallet to start using Focys today and be part of our growing community of focused, productive users.
        </p>
      </motion.div>
    </div>
  );
}

export default FocysRoadmap;
