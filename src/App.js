import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import WalletConnect from './components/WalletConnect';
import MintNFT from './components/MintNFT';
import NFTGallery from './components/NFTGallery';
import abi from './contractABI/ContractABI';


function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractInfo, setContractInfo] = useState({
    name: '',
    maxSupply: 0,
    maxPerWallet: 0,
    maxPerTx: 0,
    publicMintActive: false,
    reservedTokens: 0,
    tokenMinted: 0,
    owner: '',
  });
  const contractAddress = "YOUR_CONTRACT_ADDRESS"; 
  const contractABI = abi;

  useEffect(() => {
    const initContract = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
        setContract(contractInstance);

        // Fetch contract info
        const name = await contractInstance.name();
        const maxSupply = await contractInstance.maxSupply();
        const maxPerWallet = await contractInstance.maxPerWallet();
        const maxPerTx = await contractInstance.maxMintPerTx();
        const publicMintActive = await contractInstance.publicMintActive();
        const reservedTokens = await contractInstance.reservedTokens();
        const tokenMinted = await contractInstance.tokenMinted();
        const owner = await contractInstance.owner();

        setContractInfo({
          name,
          maxSupply: maxSupply.toString(),
          maxPerWallet: maxPerWallet.toString(),
          maxPerTx: maxPerTx.toString(),
          publicMintActive,
          reservedTokens: reservedTokens.toString(),
          tokenMinted: tokenMinted.toString(),
          owner,
        });
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };
    if (window.ethereum) {
          initContract();
        }
  }, []);

  
  return (
    <div className="container mt-5">
      <h1 className="text-center">NFT Dapp</h1>
      <div className="text-center mb-4">
        <WalletConnect setAccount={setAccount} />
        {account && <p className="mt-2">Connected: {account}</p>}
      </div>
      {contractInfo.name && (
        <div className="card p-3 mb-3">
          <h3>Contract Info</h3>
          <p><strong>Name:</strong> {contractInfo.name}</p>
          <p><strong>Max Supply:</strong> {contractInfo.maxSupply}</p>
          <p><strong>Max Per Wallet:</strong> {contractInfo.maxPerWallet}</p>
          <p><strong>Max Per Tx:</strong> {contractInfo.maxPerTx}</p>
          <p><strong>Public Mint Active:</strong> {contractInfo.publicMintActive.toString()}</p>
          <p><strong>Reserved Tokens:</strong> {contractInfo.reservedTokens}</p>
          <p><strong>Tokens Minted:</strong> {contractInfo.tokenMinted}</p>
          <p><strong>Owner:</strong> {contractInfo.owner}</p>
        </div>
      )}
      {account && contract && (
        <>
          <MintNFT account={account} contract={contract} contractInfo={contractInfo} />
          <NFTGallery account={account} contract={contract} contractABI={contractABI} />
        </>
      )}
    </div>
  );
}

export default App;