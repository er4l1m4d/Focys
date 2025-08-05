import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverFooter,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWalletStore } from '@/stores/useWalletStore';

export function UserProfile() {
  const navigate = useNavigate();
  const { currentProfile, disconnect } = useWalletStore();

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleSignOut = () => {
    disconnect();
  };

  if (!currentProfile || !currentProfile.isConnected) {
    return (
      <Button 
        variant="ghost" 
        className="h-10 w-10 rounded-full p-0"
        onClick={() => navigate('/profile')}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // Get user initials from username
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentProfile.profilePicture || `https://avatar.vercel.sh/${currentProfile.username}`} />
            <AvatarFallback style={{ backgroundColor: '#51FED6', color: 'white' }}>
              {getInitials(currentProfile.username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-62" align="end">
        <PopoverHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentProfile.profilePicture || `https://avatar.vercel.sh/${currentProfile.username}`} />
              <AvatarFallback style={{ backgroundColor: '#51FED6', color: 'white' }}>
                {getInitials(currentProfile.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <PopoverTitle>{currentProfile.username}</PopoverTitle>
              <PopoverDescription className="text-xs">
                {currentProfile.address ? 
                  `${currentProfile.address.slice(0, 6)}...${currentProfile.address.slice(-4)}` : 
                  'Wallet connected'
                }
              </PopoverDescription>
            </div>
          </div>
        </PopoverHeader>
        <PopoverBody className="space-y-1 px-2 py-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            size="sm"
            onClick={handleViewProfile}
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </PopoverBody>
        <PopoverFooter>
          <Button 
            variant="outline" 
            className="w-full bg-transparent" 
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
