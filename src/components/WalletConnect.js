import React from 'react';

function WalletConnect({ setAccount }) {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <button className="btn btn-primary" onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}

export default WalletConnect;