import { useNavigate } from 'react-router-dom';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { Home, Timer, Trophy, Gem } from 'lucide-react';
import focysLogo from '../../../focys logo - square .png';
import { UserProfile } from '../profile/UserProfile';
import { ThemeToggle } from '../theme/ThemeToggle';

export function FocysNavigation() {
  const navigate = useNavigate();

  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Focus Timer", icon: Timer },
    { type: "separator" as const },
    { title: "Crystals", icon: Gem },
    { title: "Achievements", icon: Trophy }
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
    <div className="w-full flex items-center justify-between p-4 sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <button
        className="flex items-center gap-2 text-xl font-extrabold hover:text-teal-400 transition-colors px-2 py-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        onClick={() => navigate('/dashboard')}
        aria-label="Go to dashboard"
      >
        <img src={focysLogo} alt="Focys logo" className="w-8 h-8 rounded-lg shadow-sm object-cover bg-white" />
        <span className="hidden sm:inline font-outfit font-bold tracking-tight text-[#169183]">Focys</span>
      </button>
      
      <div className="flex items-center gap-4">
        <ExpandableTabs
          tabs={tabs}
          activeColor="text-teal-400"
          className=""
          onChange={handleTabChange}
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
