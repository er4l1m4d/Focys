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
    { title: "Crystals", icon: Gem },
    { title: "Achievements", icon: Trophy }
  ];



  const handleTabChange = (index: number | null) => {
    if (index === null) return;
    
    // Get the actual tab by index, skipping separators
    let tabCount = -1;
    for (let i = 0; i <= index; i++) {
      if (tabs[i].type !== 'separator') {
        tabCount++;
      }
    }
    
    // Navigate based on the actual tab index
    switch (tabCount) {
      case 0:
        navigate('/dashboard');
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
    <div className="w-full flex items-center justify-between p-4 sticky top-0 z-40 bg-transparent border-b border-border/20">
      <button
        className="flex items-center gap-2 text-xl font-extrabold hover:text-teal-400 transition-colors px-2 py-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        onClick={() => navigate('/dashboard')}
        aria-label="Go to dashboard"
      >
        <img src={focysLogo} alt="Focys logo" className="w-8 h-8 object-contain" />
        <span className="hidden sm:inline font-outfit font-bold tracking-tight text-[#169183] bg-transparent">Focys</span>
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
