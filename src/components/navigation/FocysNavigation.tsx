import { useNavigate } from 'react-router-dom';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { 
  Home, 
  Timer, 
  Gem, 
  User, 
  Trophy
} from 'lucide-react';

export function FocysNavigation() {
  const navigate = useNavigate();

  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Focus Timer", icon: Timer },
    { type: "separator" as const },
    { title: "Crystals", icon: Gem },
    { title: "Achievements", icon: Trophy },
    { title: "Profile", icon: User },
  ];



  const handleTabChange = (index: number | null) => {
    if (index === null) return;
    
    // Calculate actual tab index accounting for separators
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
