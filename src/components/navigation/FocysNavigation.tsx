import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { 
  Home, 
  Timer, 
  Gem, 
  User, 
  Settings,
  Trophy
} from 'lucide-react';

export function FocysNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Focus Timer", icon: Timer },
    { type: "separator" as const },
    { title: "Crystals", icon: Gem },
    { title: "Achievements", icon: Trophy },
    { type: "separator" as const },
    { title: "Profile", icon: User },
    { title: "Settings", icon: Settings },
  ];

  // Get current active tab based on route
  const getActiveTabIndex = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/dashboard':
        return 0;
      case '/timer':
        return 1;
      case '/crystals':
        return 3;
      case '/achievements':
        return 4;
      case '/profile':
        return 6;
      case '/settings':
        return 7;
      default:
        return null;
    }
  };

  const handleTabChange = (index: number | null) => {
    if (index === null) return;
    
    // Skip separators
    const actualTabs = tabs.filter(tab => tab.type !== 'separator');
    const tabIndex = tabs.filter((_, i) => i <= index && tabs[i].type !== 'separator').length - 1;
    
    switch (tabIndex) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/timer');
        break;
      case 2:
        navigate('/crystals');
        break;
      case 3:
        navigate('/achievements');
        break;
      case 4:
        navigate('/profile');
        break;
      case 5:
        navigate('/settings');
        break;
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <ExpandableTabs
        tabs={tabs}
        activeColor="text-purple-600"
        className="border-purple-200 dark:border-purple-800 bg-white/80 backdrop-blur-sm"
        onChange={handleTabChange}
      />
    </div>
  );
}
