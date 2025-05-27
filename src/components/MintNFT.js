import React, { useState } from 'react';
import { ethers } from 'ethers';

function MintNFT({ account, contractAddress, contractABI }) {
  const [quantity, setQuantity] = useState("");
  const [minting, setMinting] = useState(false);

  const mint = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!quantity) {
      alert("Please provide a valid quantity.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.mintNFT(quantity,);
      await tx.wait();
      alert("NFT Minted Successfully!");
      setQuantity("");
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
        <label className="form-label">How many token you wants to mint?</label>
        <input
          type="text"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button className="btn btn-success" onClick={mint} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}

export default MintNFT;