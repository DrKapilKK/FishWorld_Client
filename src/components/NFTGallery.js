import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function NFTGallery({ account, contractAddress, contractABI }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const balance = await contract.balanceOf(account);
        const tokenIds = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const tokenURI = await contract.tokenURI(tokenId);
          tokenIds.push({ id: tokenId.toString(), uri: tokenURI });
        }
        setNfts(tokenIds);
      } catch (error) {
        console.error("Fetching NFTs failed:", error);
      }
    };
    fetchNFTs();
  }, [account, contractAddress, contractABI]);

  return (
    <div className="card p-3 mt-3">
      <h3>Your NFTs</h3>
      {nfts.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div className="row">
          {nfts.map((nft) => (
            <div key={nft.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">NFT #{nft.id}</h5>
                  <p className="card-text">URI: {nft.uri}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTGallery;