import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import {ethers} from "ethers";
import UpdateListingModal from "./UpdateListingModal.js";

export default function NFTBox({price, nftAddress, tokenId, marketplaceAddress, seller}) {
    const {isWeb3Enabled, account} = useMoralis();
    const [imageUri, setImageUri] = useState();
    const [tokenName, setTokenName] = useState('');
    const [tokenDesc, setTokenDesc] = useState('');
    const [tokenAttributes, setTokenAttributes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const hideModal = () => setIsModalVisible(false);
    const dispatch = useNotification();

    const {runContractFunction: getTokenUri} = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params:{
            tokenId: tokenId
        }
    })

    const {runContractFunction: buyItem} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params:{
            nftAddress: nftAddress,
            tokenId: tokenId
        }
    })

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "NFT bought - Please wait for the transaction to be mined",
            title: "NFT bought successfully",
            position: 'topR'
        })

    }

    async function updateUI(){
        const tokenURI = await getTokenUri();
        console.log("tokenUri", tokenURI);
        if(tokenURI){
            const requestUri = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            // console.log(requestUri);
            const response = await (await fetch(requestUri)).json();
            const imageUri = response.image;
            const imageUri_URL = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/");
            // console.log("imageUri_URL", imageUri_URL);
            setImageUri(imageUri_URL);
            setTokenName(response.name);
            setTokenDesc(response.description);
            setTokenAttributes(response.attributes);
        }

    }

    useEffect(() => {
        if(isWeb3Enabled){
            updateUI();
        }
    }, [isWeb3Enabled]);

    const isOwnedByUser = account === seller || seller === undefined;
    const formattedSellerAddress = isOwnedByUser ? "You" : `${seller.slice(0, 6)}...${seller.slice(-4)}`;

    function handleCardClick(){
        isOwnedByUser ? setIsModalVisible(true)
        : buyItem({
            onError: error => console.log(error),
            onSuccess: handleBuyItemSuccess
        })
    }

  return (
    
    <div>
        { !imageUri ? <div className="max-w-sm">Loading...</div>
            : 
            <>
            {/* <div className="w-100"> */}
            {/* <Card className="w-100"  > */}
                <div alt={isOwnedByUser?"Edit Price":"Buy NFT"} className="border border-rounded rounded-lg p-4 bg-gradient-to-tr from-green-100 via-blue-100 to-purple-200 max-w-sm h-full cursor-pointer" onClick={handleCardClick}>
                    <div className="text-right font-bold px-3">#{tokenId}</div>
                    <div className="text-right italic text-sm px-3">Owned by: {formattedSellerAddress}</div>
                    <div className="flex justify-center m-2 p-2">
                    <Image
                        className="lg:h-48 md:h-36 self-center object-cover object-center"
                        loader={() => imageUri}
                        src={imageUri}
                        height={300}
                        width={300}
                        alt={tokenName}
                    />
                    </div>
                    <div className="font-bold text-center">
                        {tokenName}
                    </div>
                    <div className="flex justify-center m-2 p-2">
                        <div className="text-ellipsis w-100 font-bold text-center">
                            {tokenDesc}
                        </div>
                    </div>
                    <div className="font-bold text-right">
                        {ethers.utils.formatUnits(price, 'ether')} ETH
                    </div>

                        
                        <h2 className="font-bold items-center">
                            Attributes:
                            <div className="flex flex-wrap">
                            {tokenAttributes.map((attribute, index) => {
                                return(
                                    
                                        <span key={index} className="border-2 border-indigo-200 hover:border-none hover:bg-indigo-300 font-light text-gray-400 hover:text-white rounded-md p-3 mx-1 my-3"> <div className="font-bold text-center">{attribute.trait_type} </div> <div className="font-light text-center"> {attribute.value}</div></span>
                                    
                                )
                            }
                            )}
                            </div>
                        </h2>
                        
                </div>
            {/* </Card> */}
            <UpdateListingModal 
                isVisible={isModalVisible}
                nftAddress={nftAddress}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                onClose={hideModal}
                />
            </>
        }
    </div>
  )
}
