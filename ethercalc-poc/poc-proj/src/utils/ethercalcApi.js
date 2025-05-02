import { ETHERCALC_URL, ETHERCALC_SHEET_ID } from './constants';

export async function getSpreadsheetData() {
  try {
    const response = await fetch(`${ETHERCALC_URL}/_/${ETHERCALC_SHEET_ID}/csv`);
    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error fetching spreadsheet:', error);
    throw error;
  }
}

// Get a specific cell value
export const getCellValue = async (cell) => {
  try {
    const response = await fetch(`${ETHERCALC_URL}/_/${ETHERCALC_SHEET_ID}/cells/${cell}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cell ${cell}: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(`Error fetching cell ${cell}:`, error);
    throw error;
  }
};

// Get a range of cells
export const getCellRange = async (startCell, endCell) => {
  try {
    const response = await fetch(`${ETHERCALC_URL}/_/${ETHERCALC_SHEET_ID}/cells/${startCell}:${endCell}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch range ${startCell}:${endCell}: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(`Error fetching range ${startCell}:${endCell}:`, error);
    throw error;
  }
};

export async function updateCell(cellCoord, value) {
  // Format command according to Ethercalc's socialtext format
  const command = `set ${cellCoord} text t ${value}\n`;
  
  try {
    const response = await fetch(`${ETHERCALC_URL}/_/${ETHERCALC_SHEET_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: command,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update cell: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating cell:', error);
    throw error;
  }
}

// Parse CSV data to usable format for proposals
export const parseProposalData = (csvData) => {
  // Split CSV into rows
  const rows = csvData.split('\n');
  
  // Skip header row (assume first row is header)
  const dataRows = rows.slice(1);
  
  // Parse each row into a proposal object
  return dataRows.map((row, index) => {
    const cells = row.split(',');
    
    return {
      id: index + 1, // Row index starting from 1
      rowNumber: index + 2, // Actual row number in spreadsheet (including header)
      name: cells[0]?.trim() || '', 
      description: cells[1]?.trim() || '',
      requestedAmount: parseFloat(cells[2]) || 0,
      score: parseFloat(cells[3]) || 0,
      address: cells[4]?.trim() || '0x0000000000000000000000000000000000000000'
    };
  }).filter(proposal => proposal.name); // Filter out empty rows
};