import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function NFTGallery({ account, contract, contractABI }) {
  const [nfts, setNfts] = useState([]);
  const [tokensMintedByUser, setTokensMintedByUser] = useState(0);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account || !contract) return;
      try {
        // Fetch the number of tokens minted by the user via publicMint
        const mintedByUser = await contract.tokenMintedby(account);
        setTokensMintedByUser(mintedByUser.toString());

        // Fetch total tokens minted in the contract
        const totalMinted = await contract.tokenMinted();

        // Check ownership for each token ID up to totalMinted
        const tokenIds = [];
        for (let i = 0; i < totalMinted; i++) {
          try {
            const owner = await contract.ownerOf(i);
            if (owner.toLowerCase() === account.toLowerCase()) {
              const tokenURI = await contract.tokenURI(i);
              tokenIds.push({ id: i.toString(), uri: tokenURI });
            }
          } catch (error) {
            // Token may not exist; skip silently
          }
        }

        setNfts(tokenIds);
      } catch (error) {
        console.error("Fetching NFTs failed:", error);
      }
    };
    fetchNFTs();
  }, [account, contract]);

  return (
    <div className="card p-3 mt-3">
      <h3>Your NFTs</h3>
      <p>
        <strong>Tokens Minted by You (Public Mint):</strong> {tokensMintedByUser}
      </p>
      <p>
        <strong>Total Tokens Owned:</strong> {nfts.length}
      </p>
      {nfts.length === 0 ? (
        <p>No NFTs owned.</p>
      ) : (
        <div className="row">
          {nfts.map((nft) => (
            <div key={nft.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">NFT #{nft.id}</h5>
                  <p className="card-text">
                    <strong>URI:</strong>{' '}
                    <a href={nft.uri} target="_blank" rel="noopener noreferrer">
                      {nft.uri}
                    </a>
                  </p>
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