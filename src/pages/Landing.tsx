import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AppSlideshow } from "@/components/ui/AppSlideshow";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import FocysRoadmap from "@/components/ui/focys-roadmap";
import FocysFaqSection from "@/components/ui/FocysFaqSection";
import { useWalletStore } from "@/stores/useWalletStore";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const { setConnection, currentProfile } = useWalletStore();

  // Focys wallet connect logic: replace with your actual wallet connect function
  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert('MetaMask or another Ethereum wallet is required.');
      return;
    }
    try {
      const provider = (window as any).ethereum;
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const chainIdHex = await provider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      setConnection(address, chainId);
    } catch (error) {
      alert('Wallet connection failed.');
      console.error(error);
    }
  }
  const navigate = useNavigate();

  // If already connected, go to dashboard
  if (currentProfile?.isConnected) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 mt-8 md:mt-12 w-full">
          <div className="flex-1 min-w-0 md:max-w-[50%] px-2">
            <h1 className="text-4xl md:text-5xl font-bold heading-outfit text-[#169183] mb-4 text-center md:text-left">Gamify Your Focus.</h1>
            <p className="text-lg text-foreground mb-4 text-center md:text-left">Focys is your all-in-one focus companion: track Pomodoro sessions, earn XP, collect crystals, and store your achievements on Irys. Level up your productivity and own your progress anywhere & anytime.</p>
            <div className="flex justify-center md:justify-start mt-4">
              <InteractiveHoverButton text="Connect Wallet" onClick={connectWallet} className="text-sm" />
            </div>
          </div>
          <div className="flex-1 min-w-0 md:max-w-[50%] flex justify-center px-2">
            <div className="w-full max-w-[750px] transition-all duration-300 hover:scale-[1.02] flex flex-col items-center">
              <AppSlideshow />
            </div>
          </div>
        </div>
      </div>
      <div id="features" className="mt-24 md:mt-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2 md:mb-4">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit text-[#169183] mb-2">
            Everything You Need to Stay in Flow
          </h2>
          <p className="text-lg md:text-xl font-outfit text-foreground">
            Tools That Turn Discipline Into a Game
          </p>
        </div>
        <FeaturesSectionWithHoverEffects />
      </div>
      <div id="roadmap" className="mt-16">
        <FocysRoadmap />
      </div>
      <div id="faq" className="mt-16">
        <FocysFaqSection />
      </div>
      <footer className="w-full py-8 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-muted-foreground">
              © 2025 Focys — Made with <span className="text-red-500">♥</span> by Jigz
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://x.com/jigz_crypto" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-[#169183] transition-colors"
              >
                Twitter
              </a>
              <span className="text-muted-foreground/50">·</span>
              <a 
                href="https://discord.com/users/1182751491279310918" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-[#169183] transition-colors"
              >
                Discord
              </a>
              <span className="text-muted-foreground/50">·</span>
              <a 
                href="https://github.com/er4l1m4d/Focys" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-[#169183] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

