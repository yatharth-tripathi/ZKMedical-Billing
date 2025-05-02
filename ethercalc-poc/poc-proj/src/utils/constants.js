export const ETHERCALC_URL = import.meta.env.VITE_ETHERCALC_URL || 'https://ethercalc.net';
export const ETHERCALC_SHEET_ID = import.meta.env.VITE_ETHERCALC_SHEET_ID;
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CONTRACT_ABI = [
  // View functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  // Write functions
  'function transfer(address to, uint256 amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// This would be our mapping from spreadsheet rows to proposal IDs
export const PROPOSAL_MAPPING = {
  2: "Proposal 1", // Row 2 represents Proposal 1
  3: "Proposal 2", // Row 3 represents Proposal 2
  4: "Proposal 3"  // Row 4 represents Proposal 3
};