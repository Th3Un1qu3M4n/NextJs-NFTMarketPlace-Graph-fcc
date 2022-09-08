import Link from "next/link"
import { ConnectButton } from "web3uikit"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis } from "react-moralis"

export default function Header() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
  return (
    <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
            <Link href="/">
                <a className="mr-5 font-bold hover:text-gray-900">Home</a>
            </Link>
            <Link href="/sell-page">
            <a className="mr-5 font-bold hover:text-gray-900">Sell NFT</a>
            </Link>
            {/* <a className="mr-5 hover:text-gray-900">First Link</a>
            <a className="mr-5 hover:text-gray-900">Second Link</a>
            <a className="mr-5 hover:text-gray-900">Third Link</a>
            <a className="hover:text-gray-900">Fourth Link</a> */}
            </nav>
            {/* <Link > */}
            <a href={"https://goerli.etherscan.io/address/"+marketplaceAddress} target="_blank" rel="noreferrer" className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="ml-3 text-xl">NFT MarketPlace</span>
            </a>
            {/* </Link> */}
            <div className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 py-4">
                <ConnectButton moralisAuth={false}/>
            </div>
        </div>
    </header>
  )
}
