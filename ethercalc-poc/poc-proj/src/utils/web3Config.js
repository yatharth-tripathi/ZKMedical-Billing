import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { createConfig } from 'wagmi'
import { polygonZkEvmCardona } from 'wagmi/chains'

// Configure providers
const alchemyId = import.meta.env.VITE_ALCHEMY_ID

// Configure chains & providers with http transport
const transport = http(`https://polygonzkevm-cardona.g.alchemy.com/v2/${alchemyId}`)

// Export chains for use in other files
export const chains = [polygonZkEvmCardona]

// Configure wallet connectors
const { connectors } = getDefaultWallets({
  appName: 'EtherCalc Web3 PoC',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains,
  // Fix metadata URL warning by using window.location
  metadata: {
    name: 'EtherCalc Web3 PoC',
    description: 'EtherCalc Web3 Integration Proof of Concept',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
})

// Create and export wagmi config
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [polygonZkEvmCardona.id]: transport
  },
  connectors,
})