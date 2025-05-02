import { useState } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { useEthercalcData } from '../hooks/useEthercalcData';
import { useContractFunctions } from '../hooks/useContractFunctions';
import { updateCell } from '../utils/ethercalcApi';

export default function ProposalScoring() {
  const { address, isConnected } = useAccount();
  const { proposals, loading, error, refetch } = useEthercalcData(5000); // Refresh every 5 seconds
  const { voteForProposal, transactionPending } = useContractFunctions();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [scoreAmount, setScoreAmount] = useState(1);
  
  const handleVote = async () => {
    if (!isConnected || !selectedProposal) {
      toast.error('Please connect wallet and select a proposal');
      return;
    }
    
    try {
      // Vote on-chain by transferring tokens
      const proposalAddress = selectedProposal.address;
      await voteForProposal(proposalAddress, scoreAmount);
      
      // Update the Ethercalc cell with the new score
      const currentScore = selectedProposal.score || 0;
      const newScore = currentScore + Number(scoreAmount);
      const cellToUpdate = `D${selectedProposal.rowNumber}`; // Column D contains scores
      
      await updateCell(cellToUpdate, newScore.toString());
      
      toast.success(`Successfully voted for ${selectedProposal.name}`);
      
      // Refresh the proposal data
      await refetch();
      
      // Reset form
      setSelectedProposal(null);
      setScoreAmount(1);
    } catch (error) {
      console.error('Error during voting process:', error);
      toast.error('Failed to submit vote. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading proposals...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Proposal Scoring</h2>
      
      {!isConnected ? (
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          Please connect your wallet to vote on proposals
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select Proposal</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedProposal ? selectedProposal.id : ''}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                const proposal = proposals.find(p => p.id === id);
                setSelectedProposal(proposal);
              }}
            >
              <option value="">-- Select a proposal --</option>
              {proposals.map(proposal => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.name} - Current Score: {proposal.score || 0}
                </option>
              ))}
            </select>
          </div>
          
          {selectedProposal && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Score Amount (1-10)</label>
                <input 
                  type="number"
                  min="1"
                  max="10"
                  className="w-full p-2 border rounded-md"
                  value={scoreAmount}
                  onChange={(e) => setScoreAmount(Number(e.target.value))}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold">{selectedProposal.name}</h3>
                <p className="text-gray-600">{selectedProposal.description}</p>
                <p className="mt-2">
                  <span className="font-medium">Requested:</span> {selectedProposal.requestedAmount} ETH
                </p>
                <p>
                  <span className="font-medium">Current Score:</span> {selectedProposal.score || 0}
                </p>
              </div>
              
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                onClick={handleVote}
                disabled={transactionPending || !selectedProposal}
              >
                {transactionPending ? 'Processing...' : 'Submit Vote'}
              </button>
            </>
          )}
        </>
      )}
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Proposals Overview</h3>
        <div className="space-y-2">
          {proposals.map(proposal => (
            <div key={proposal.id} className="p-3 bg-gray-50 rounded-md flex justify-between">
              <span>{proposal.name}</span>
              <span className="font-medium">Score: {proposal.score || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}