import React, { useState } from 'react';
import { ethers } from 'ethers';

function MintNFT({ account, contractAddress, contractABI }) {
  const [tokenURI, setTokenURI] = useState("");
  const [minting, setMinting] = useState(false);

  const mint = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!tokenURI) {
      alert("Please provide a valid Token URI!");
      return;
    }

    setMinting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.mintNFT(account, tokenURI);
      await tx.wait();
      alert("NFT Minted Successfully!");
      setTokenURI("");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Please try again.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="card p-3 mt-3">
      <h3>Mint a New NFT</h3>
      <div className="mb-3">
        <label className="form-label">Token URI (e.g., IPFS link)</label>
        <input
          type="text"
          className="form-control"
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
          placeholder="https://ipfs.io/ipfs/..."
        />
      </div>
      <button className="btn btn-success" onClick={mint} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}

export default MintNFT;