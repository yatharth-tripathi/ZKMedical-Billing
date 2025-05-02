import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonZkEvmCardona } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// Create a client with faster timeouts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduce retry attempts
      staleTime: 10000, // Reduce stale time to 10s
      cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false // Prevent unnecessary refetches
    },
  },
});

const config = createConfig(
  getDefaultConfig({
    chains: [polygonZkEvmCardona],
    transports: {
      [polygonZkEvmCardona.id]: http(
        `https://polygonzkevm-cardona.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_ID}`,
        {
          timeout: 5000, // Reduced timeout to 5 seconds
          retryCount: 1, // Reduced retry count
          retryDelay: 500, // Faster retry delay
          batch: true // Enable request batching
        }
      ),
    },

    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
    
    // Improved connection settings
    connectionClientOptions: {
      enablePreload: true, // Preload connection data
      enableCaching: true, // Enable caching
      enableQueueing: false // Disable queueing to speed up initial connection
    },

    appName: "Web3 Medical Invoice Dapp",
    appDescription: "A Dapp to create and manage medical invoices.",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
  })
);

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
