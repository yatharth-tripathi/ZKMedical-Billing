import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Ethercalc Web3 PoC</h1>
          <p className="text-blue-100">Decentralized Collaborative Spreadsheets</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Ethercalc Web3 Integration Proof of Concept</p>
          <p className="text-sm mt-2">Built with Vite, React, Ethercalc, and Sepolia</p>
        </div>
      </footer>
    </div>
  );
}