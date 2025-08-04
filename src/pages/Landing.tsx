import { HeroSection } from "@/components/ui/hero-section";
import { useWalletStore } from "@/stores/useWalletStore";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";

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
    <HeroSection
      badge={{
        text: "Introducing Focys",
        action: {
          text: "Learn more",
          href: "/about",
        },
      }}
      title="Gamify Your Focus."
      description="Focys helps you build deep focus habits and track your progress, with Web3-powered rewards and permanent session history."
      actions={[
        {
          text: "Get Started",
          href: "#",
          icon: <ArrowRight className="h-5 w-5" />, 
          variant: "default",
          onClick: connectWallet,
        },
        {
          text: "GitHub",
          href: "https://github.com/er4l1m4d/Focys",
          icon: <Github className="h-5 w-5" />, 
          variant: "outline",
        },
      ]}
      image={{
        light: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1248&q=80",
        dark: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1248&q=80",
        alt: "Focys App Screenshot",
      }}
    />
  );
}
