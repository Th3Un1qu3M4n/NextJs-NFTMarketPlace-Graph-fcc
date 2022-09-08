import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Input, Modal, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers";

export default function UpdateListingModal({isVisible, price, nftAddress, tokenId, marketplaceAddress, seller, onClose}) {
    const [priceToUpdateListing, setPriceToUpdateListing] = useState(0);
    const dispatch = useNotification();

    const {runContractFunction: updateListing} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params:{
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListing || "0")
        }
    })

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing updated - Please wait for the transaction to be mined",
            title: "Listing updated successfully",
            position: 'topR'
        })
        onClose && onClose();
        setPriceToUpdateListing(0);
    }

  return (
    <Modal
        isVisible={isVisible}
        title="Update NFT Listing"
        onCancel={onClose}
        onCloseButtonPressed={onClose}
        onOk={()=>{
            updateListing( {
                onError: error => console.log(error),
                onSuccess: handleUpdateListingSuccess
            });
            // onClose();
        }}
    >
        <Input
            label="Upate Price in L1 Currency (ETH)"
            placeholder="Enter Price"
            name="New Listing Price"
            type="number"
            onChange={(evenet)=>{
                setPriceToUpdateListing(event.target.value);
            }}
            />
    </Modal>
  )
}
