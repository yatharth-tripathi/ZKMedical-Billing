import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useContractFunctions } from '../hooks/useContractFunctions';

export default function ContractInteraction() {
  const { isConnected, address } = useAccount();
  const { tokenName, tokenSymbol, tokenDecimals, balance, signMessage } = useContractFunctions();
  const [signature, setSignature] = useState('');
  const [isSigningMessage, setIsSigningMessage] = useState(false);

  const handleSignMessage = async () => {
    if (!isConnected) return;
    
    try {
      setIsSigningMessage(true);
      const message = `I am verifying my ownership of wallet ${address} for Ethercalc-Web3 PoC. Timestamp: ${Date.now()}`;
      const sig = await signMessage(message);
      setSignature(sig);
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setIsSigningMessage(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg text-center">
        Please connect your wallet to interact with the contract.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Token Contract Information</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700">Token Details</h3>
          <p>Name: {tokenName || 'Loading...'}</p>
          <p>Symbol: {tokenSymbol || 'Loading...'}</p>
          <p>Decimals: {tokenDecimals || 'Loading...'}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700">Your Wallet</h3>
          <p className="mb-2">Address: {address}</p>
          <p>Balance: {balance ? (parseInt(balance) / Math.pow(10, tokenDecimals || 18)).toFixed(4) : '0'} {tokenSymbol}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Wallet Authentication</h3>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleSignMessage}
            disabled={isSigningMessage}
          >
            {isSigningMessage ? 'Signing...' : 'Sign Authentication Message'}
          </button>
          
          {signature && (
            <div className="mt-4">
              <p className="font-medium">Signature:</p>
              <p className="text-xs break-all bg-gray-100 p-2 rounded mt-1">{signature}</p>
              <p className="text-sm text-gray-600 mt-2">
                This signature could be used for off-chain authentication or permissions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}