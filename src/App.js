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
  const [mintTxDetails, setMintTxDetails] = useState(null);
  const [contractInfo, setContractInfo] = useState({
    name: '',
    maxSupply: 0,
    maxPerWallet: 0,
    maxPerTx: 0,
    publicMintActive: false,
    reservedTokens: 0,
    tokenMinted: 0,
    publicPrice: 0,
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
        const publicPrice = await contractInstance.pricePublic();

        setContractInfo({
          name,
          maxSupply: maxSupply.toString(),
          maxPerWallet: maxPerWallet.toString(),
          maxPerTx: maxPerTx.toString(),
          publicMintActive,
          reservedTokens: reservedTokens.toString(),
          tokenMinted: tokenMinted.toString(),
          publicPrice: publicPrice.toString(),
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
      <h1 className="text-center mb-4">Fish World</h1>
      <div className="text-center mb-4">
        <WalletConnect setAccount={setAccount} />
        {account && <p className="mt-2">Connected: {account}</p>}
      </div>

      {contractInfo.name && (
        <div className="d-flex justify-content-between align-items-start flex-wrap custom-layout">
          {/* Left Contract Info */}
          <div className="contract-info-card">
            <h3>Contract Info</h3>
            <p><strong>Max Supply:</strong> {contractInfo.maxSupply}</p>
            <p><strong>Max Per Wallet:</strong> {contractInfo.maxPerWallet}</p>
            <p><strong>Max Per Tx:</strong> {contractInfo.maxPerTx}</p>
            <p><strong>Public Mint Active:</strong> {contractInfo.publicMintActive.toString()}</p>
            <p><strong>Reserved Tokens:</strong> {contractInfo.reservedTokens}</p>
            <p><strong>Tokens Minted:</strong> {contractInfo.tokenMinted}</p>
            <p><strong>Token Price:</strong> {contractInfo.publicPrice}</p>
            <p><strong>Owner:</strong> {contractInfo.owner}</p>
          </div>

          {/* Mint + Gallery Center */}
          <div className="mint-gallery-section">
            {account && contract && (
              <>
                <MintNFT account={account} contract={contract} contractInfo={contractInfo} contractABI={contractABI} setMintTxDetails={setMintTxDetails} />
                <NFTGallery account={account} contract={contract} contractABI={contractABI} />
              </>
            )}
          </div>

          {/* Right Contract Info (copy) */}
          <div className="contract-info-card">
            <h3>Transaction Details:</h3>

            {mintTxDetails ? (
              <>
                <p><strong>Token ID:</strong> {mintTxDetails.tokenId}</p>
                <p><strong>Owner:</strong> {mintTxDetails.owner}</p>
                <p><strong>Gas Used:</strong> {mintTxDetails.gasUsed}</p>
                <p><strong>From:</strong> {mintTxDetails.txDetails.from}</p>
                <p><strong>To:</strong> {mintTxDetails.txDetails.to}</p>
                <p><strong>Value (ETH):</strong> {mintTxDetails.txDetails.valueEth}</p>
                <p><strong>Gas Price (Gwei):</strong> {mintTxDetails.txDetails.gasPriceGwei}</p>
                <p><strong>Gas Limit:</strong> {mintTxDetails.txDetails.gasLimit}</p>
              </>
            ) : (
              <>
                <p>No transaction minted yet.</p>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;