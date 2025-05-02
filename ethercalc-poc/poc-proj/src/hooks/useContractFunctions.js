import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';
import { useState } from 'react';

export function useContractFunctions() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [transactionPending, setTransactionPending] = useState(false);
  const { writeContract } = useWriteContract();

  // Read token name
  const { data: tokenName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'name',
  });

  // Read token symbol
  const { data: tokenSymbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'symbol',
  });

  // Read token decimals
  const { data: tokenDecimals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'decimals',
  });

  // Read user balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: Boolean(address),
  });

  // Transfer tokens as votes
  const voteForProposal = async (proposalAddress, scoreAmount) => {
    if (!writeContract) return false;
    
    try {
      setTransactionPending(true);
      
      // Convert score to token amount (assuming 1:1 ratio)
      const amountInWei = parseEther(scoreAmount.toString());
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transfer',
        args: [proposalAddress, amountInWei],
      });

      await refetchBalance();
      return true;
    } catch (error) {
      console.error('Error voting for proposal:', error);
      throw error;
    } finally {
      setTransactionPending(false);
    }
  };

  // Sign a message to verify wallet ownership (for permissioning)
  const signMessage = async (message) => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const signature = await walletClient.signMessage({
        message,
      });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  return {
    tokenName,
    tokenSymbol,
    tokenDecimals,
    balance,
    voteForProposal,
    signMessage,
    transactionPending,
  };
}