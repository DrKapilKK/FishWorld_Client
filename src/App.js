import React, { useState } from 'react';
import './App.css';
import WalletConnect from './components/WalletConnect';
import MintNFT from './components/MintNFT';
import NFTGallery from './components/NFTGallery';

function App() {
  const [account, setAccount] = useState(null);
  const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
  const contractABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "recipient", "type": "address" },
        { "internalType": "string", "name": "tokenURI", "type": "string" }
      ],
      "name": "mintNFT",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" },
        { "internalType": "uint256", "name": "index", "type": "uint256" }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "tokenURI",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center">NFT Dapp</h1>
      <div className="text-center mb-4">
        <WalletConnect setAccount={setAccount} />
        {account && <p className="mt-2">Connected: {account}</p>}
      </div>
      {account && (
        <>
          <MintNFT account={account} contractAddress={contractAddress} contractABI={contractABI} />
          <NFTGallery account={account} contractAddress={contractAddress} contractABI={contractABI} />
        </>
      )}
    </div>
  );
}

export default App;