import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useContractFunctions } from '../hooks/useContractFunctions';
import React from 'react';

const ConnectWallet = ({ onConnected }) => {
  const { isConnected, address } = useAccount();
  const { tokenSymbol, balance, tokenDecimals } = useContractFunctions();
  
  // Format balance based on decimals (default to 18 if not loaded yet)
  const formattedBalance = balance 
    ? (parseInt(balance) / Math.pow(10, tokenDecimals || 18)).toFixed(2) 
    : '0.00';

  // Call the onConnected callback when wallet connects
  React.useEffect(() => {
    if (isConnected) {
      onConnected?.()
    }
  }, [isConnected, onConnected])

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="flex flex-col items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg shadow"
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    onClick={openConnectModal} 
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button 
                    onClick={openChainModal}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Wrong network
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    {chain.hasIcon && (
                      <div className="w-5 h-5">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-5 h-5"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <span>{account.displayName}</span>
                    <span>{account.displayBalance}</span>
                  </button>
                </div>
              )
            })()}
            {isConnected && (
              <div className="mt-4 text-center">
                <p className="font-semibold">Your Balance</p>
                <p className="text-xl">{formattedBalance} {tokenSymbol || 'Tokens'}</p>
              </div>
            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default ConnectWallet;