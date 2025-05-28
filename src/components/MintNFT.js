import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Decimal } from 'decimal.js';


function MintNFT({ account, contract, contractInfo, contractABI,setMintTxDetails }) {
  const [qty, setQty] = useState(1);
  const [toAddress, setToAddress] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [minting, setMinting] = useState(false);
  const [settingPrice, setSettingPrice] = useState(false);

  const publicMint = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!contractInfo.publicMintActive) {
      alert("Public mint is not active!");
      return;
    }
    if (qty <= 0 || qty > parseInt(contractInfo.maxPerTx)) {
      alert(`Quantity must be between 1 and ${contractInfo.maxPerTx}`);
      return;
    }
    
    setMinting(true);
    try {
      const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(signer);
      const valueInWei =contractInfo.publicPrice * qty;//ethers.parseEther((contractInfo.publicPrice * qty).toString()); // Assuming pricePublic is 0.01 ETH
      const tx = await contractWithSigner.publicMint(qty, { value: valueInWei });
      const receipt = await tx.wait(5);
      alert(`NFT minted successfully, click on OK and wait for Tx receipt.`)
      const txDetails = await fetchTxDetails(tx.hash, contract, contractABI,setMintTxDetails);
      alert(`NFT(s) Minted! Token ID: ${txDetails.tokenId}`);
    } catch (error) {
      console.error("Public minting failed:", error);
      alert("Public minting failed. Please try again.");
    } finally {
      setMinting(false);
    }
  };

  const ownerMint = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    if (account.toLowerCase() !== contractInfo.owner.toLowerCase()) {
      alert("Only the contract owner can mint reserved tokens!");
      return;
    }
    if (qty <= 0 || qty > parseInt(contractInfo.reservedTokens)) {
      alert(`Quantity must be between 1 and ${contractInfo.reservedTokens}`);
      return;
    }
    if (!ethers.isAddress(toAddress)) {
      alert("Please provide a valid address.");
      return;
    }

    setMinting(true);
    try {
      const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.ownerMint(toAddress, qty);
      const receipt = await tx.wait(5);
      const txDetails = await fetchTxDetails(tx.hash, contract,contractABI,setMintTxDetails);
      alert(`NFT(s) Minted! Token ID: ${txDetails.tokenId}`);
    } catch (error) {
      console.error("Owner minting failed:", error);
      alert("Owner minting failed. Please try again.");
    } finally {
      setMinting(false);
    }
  };

  const setPricePublic = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    if (account.toLowerCase() !== contractInfo.owner.toLowerCase()) {
      alert("Only the contract owner can set the price!");
      return;
    }
    if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
      alert("Please provide a valid price in ETH.");
      return;
    }

    setSettingPrice(true);
    try {
      const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(signer);
      const newPriceInWei = ethers.parseEther(newPrice);
      // console.log("new price is :",newPriceInWei);
      const tx = await contractWithSigner.setPricePublic(newPriceInWei);
      await tx.wait(5);
      alert("Public mint price updated successfully!");
      setNewPrice('');
    } catch (error) {
      console.error("Setting price failed:", error);
      alert("Setting price failed. Please try again.");
    } finally {
      setSettingPrice(false);
    }
  };

  const fetchTxDetails = async (txHash, contract,contractABI,setMintTxDetails) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const receipt = await provider.getTransactionReceipt(txHash);
    console.log("Tx Receipt is:", receipt);
    if (!receipt) {
      console.log("Transaction receipt not found yet.");
      return {};
    }

    const iface = new ethers.Interface(contractABI);
    let tokenId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog.name === "TokenMinted") {
          tokenId = parsedLog.args.tokenId.toString();
          console.log("TokenMinted Event - User:", parsedLog.args.user, "Token ID:", tokenId);
        }
      } catch (err) {
        // Log doesn't match ABI
      }
    }
    console.log("tokenid is : ",tokenId);
    const owner = await contract.ownerOf(tokenId);
    const tx = await provider.getTransaction(txHash);
    const wei = new Decimal(tx.value.toString());
    const priceInEth = wei.div("1e18").toString();
    const gasPriceInWei = new Decimal(tx.gasPrice.toString());
    const gasPriceInGWei = gasPriceInWei.div("1e9").toString();
    setMintTxDetails({
      receipt,
      tokenId,
      owner,
      gasUsed: receipt.gasUsed.toString(),
      txDetails: {
        from: tx.from,
        to: tx.to,
        valueEth: priceInEth,
        gasPriceGwei: gasPriceInGWei,
        gasLimit: tx.gasLimit.toString(),
      },
    });
    return {
      receipt,
      tokenId,
      owner,
      gasUsed: receipt.gasUsed.toString(),
      txDetails: {
        from: tx.from,
        to: tx.to,
        valueEth: priceInEth,
        gasPriceGwei: gasPriceInGWei,
        gasLimit: tx.gasLimit.toString(),
      },
    };
  };

  return (
    <div className="card p-3 mt-3">
      <h3>Mint Fish</h3>
       <img
          src="/betta_fish.png"
          alt="NFT Preview"
          style={{ width: '500px', height: '300px', objectFit: 'cover', margin: '0 auto', display: 'block' }}
        />
      {account && account.toLowerCase() !== contractInfo.owner.toLowerCase() && (
          <>
            <div className="mb-3">
              <label className="form-label">Quantity (Max: {contractInfo.maxPerTx})</label>
              <input
                type="number"
                className="form-control"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
                placeholder={`1 to ${contractInfo.maxPerTx}`}
              />
            </div>
            <button
              className="btn btn-success mb-3"
              onClick={publicMint}
              disabled={minting || !contractInfo.publicMintActive}
            >
              {minting ? "Minting..." : "Public Mint"}
            </button>
          </>
        )}
      {account && account.toLowerCase() === contractInfo.owner.toLowerCase() && (
        <>
          <div className="mb-3">
            <label className="form-label">Recipient Address (Owner Mint)</label>
            <input
              type="text"
              className="form-control"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Quantity (Max: {contractInfo.maxPerTx})</label>
            <input
              type="number"
              className="form-control"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value))}
              placeholder={`1 to ${contractInfo.maxPerTx}`}
            />
          </div>
          <button
            className="btn btn-success mb-3"
            onClick={ownerMint}
            disabled={minting}
          >
            {minting ? "Minting..." : "Owner Mint"}
          </button>
          <div className="mb-3">
            <label className="form-label">New Public Mint Price (ETH)</label>
            <input
              type="text"
              className="form-control"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="e.g., 0.01"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick ={setPricePublic}
            disabled={settingPrice}
          >
            {settingPrice ? "Setting Price..." : "Set Public Price"}
          </button>
        </>
      )}
      
    </div>
  );
}

export default MintNFT;