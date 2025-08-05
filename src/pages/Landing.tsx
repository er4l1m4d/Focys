import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import dashboardImage from "../../focys dashboard.png";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import FocysRoadmap from "@/components/ui/focys-roadmap";
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
            <h1 className="text-4xl md:text-5xl font-bold heading-outfit text-foreground mb-4 text-center md:text-left">Gamify Your Focus.</h1>
            <p className="text-lg text-foreground mb-4 text-center md:text-left">Focys is your all-in-one focus companion: track Pomodoro sessions, earn XP, collect crystals, and store your achievements on Web3. Level up your productivity and own your progress—anywhere, anytime.</p>
            <div className="flex justify-center md:justify-start mt-4">
              <InteractiveHoverButton text="Connect Wallet" onClick={connectWallet} className="text-sm" />
            </div>
          </div>
          <div className="flex-1 min-w-0 md:max-w-[50%] flex justify-center md:justify-end px-2">
            <img
              src={dashboardImage}
              alt="Focys Dashboard Screenshot"
              className="rounded-xl shadow-lg object-cover w-full h-auto max-h-[340px]"
              style={{maxWidth: '100%', aspectRatio: '16/7', background:'#181B23'}} // fallback bg for transparency
            />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <FeaturesSectionWithHoverEffects />
      </div>
      <div className="mt-16">
        <FocysRoadmap />
      </div>
      <footer className="w-full py-6 flex justify-center items-center text-sm text-muted-foreground">
        Made with <span className="mx-1 text-red-500">♥</span> by <a href="https://x.com/jigz_crypto" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Jigz</a>
      </footer>
    </div>
  );
}

