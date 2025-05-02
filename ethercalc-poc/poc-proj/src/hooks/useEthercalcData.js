import { useState, useEffect } from 'react';
import { getSpreadsheetData, parseProposalData } from '../utils/ethercalcApi';

export function useEthercalcData(refreshInterval = 0) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const csvData = await getSpreadsheetData();
      const proposalList = parseProposalData(csvData);
      
      setProposals(proposalList);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const refetch = () => {
    setLoading(true);
    return fetchData();
  };

  return {
    proposals,
    loading,
    error,
    refetch
  };
}