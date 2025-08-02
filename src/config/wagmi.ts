import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'
import { metaMask, walletConnect, injected } from 'wagmi/connectors'

// WalletConnect project ID - you'll need to get this from https://cloud.walletconnect.com/
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Focys',
        description: 'Gamified Focus Tracker with Web3 Integration',
        url: 'https://focys.app',
        icons: ['https://focys.app/icon.png']
      }
    }),
    injected()
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
