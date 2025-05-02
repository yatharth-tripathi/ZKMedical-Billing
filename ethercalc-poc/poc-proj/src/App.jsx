import { useAccount } from 'wagmi';
import Layout from './components/Layout';
import ConnectWallet from './components/ConnectWallet';
import EthercalcViewer from './components/EthercalcViewer';
import ProposalScoring from './components/ProposalScoring';
import ContractInteraction from './components/ContractInteraction';

function App() {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ConnectWallet />
          
          {isConnected && (
            <div className="mt-6">
              <ContractInteraction />
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Collaborative Spreadsheet</h2>
            <EthercalcViewer />
          </div>
          
          <ProposalScoring />
        </div>
      </div>
    </Layout>
  );
}

export default App;