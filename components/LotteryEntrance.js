// have a function to enter the lottery --> use moralis
// moralis have hooks: useWeb3Contract
// gives us data returned from function
// just need to pass in abi etc.

// tailwind css formatting library

import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    // to get chainId: hex addition of chainId
    // header passes all info about metamask to moralis provider
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    // const {chainId} = useMoralis()
    // console.log(chainId)
    // convert to dec
    // console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // use state hook instead, triggers re-render
    // entrance fee going to start out as "0"
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setNumPlayer] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    // how to get the parameters
    // abi: wont change no matter what network we are on

    // this function can both send transactions and read state
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })

    async function UpdateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayer(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }
    // function that reads entrance fee right when lotteryEntrance loads
    // but once we get entrance fee, browser does not rerender
    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read raffle entrance fee
            UpdateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        // wait for tx to go through
        await tx.wait(1)
        handleNewNotification(tx)
        UpdateUI()
    }

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    // no need async function
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl"></h1>
            Hi from lottery entrance
            {/* only if it is raffle address, then we will be able to call getEntranceFee()  */}
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                // checks if transaction successfully sent to metamask
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        // cannot click raffle button when transaction is loading
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH </div>
                    <div>Number of Players : {numPlayer}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    )
}

// additional challenge:
// using moralis, once call mocking script from backend, need to refresh browser
// to see winner... and reset everything
// want ui to automatically update once something gets fired
// can set up portion to listen for event when it is emitted in backend
// can also listen for winner event
