// use {} to indicate js code

// create chunk of html that we are going to export into index.js
// help to modularise and reuse header component
// enable web3
import { useMoralis } from "react-moralis"
// core hook directly from react
import { useEffect } from "react"

export default function ManualHeader() {
    // useMoralis is a react hook, to keep track of states in our app
    // Hooks let you "hook into" react state and lifecycle features
    // the below activates the connect button to connect to metamask using react-moralis
    // isWeb3Enabled : part of hook to keep track whether metamask is connected
    // account : to check if account is present
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    // when refresh, need to click "connect" again
    // useEffect: takes 2 parameters, function and optionally, dependency array
    // keep checking the values in dependency array.if anything in dependency array changes,
    // call function and re render front-end
    // constantly re run and listen to see if isWeb3Enabled is changed
    // if no dependency array, will run everytime something re-renders
    // Be careful! can get circular renders
    // blank dependency array: run once on load
    // now runs twice: due to react.strict mode , basically re-rendering once in the background
    // ref github for more info
    useEffect(() => {
        if (isWeb3Enabled) return
        // so that whenever refresh checks local storage first, then display
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
        // enableWeb3()
    }, [isWeb3Enabled])

    // when we re-render, want to run when any account has changed
    // when switch account in metamask and refresh, print account changed to ...
    // if we disconnect, removed from localStorage
    // refresh also not connected.
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3() // sets web3enable to false
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        // want application/local storage to remember someone clicked connect button
                        // set new key-value in local storage, inject shows that we are connected to metamask
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    // ensure when when metamask pops out, "connect" button disabled
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
// React moralis
// Hard way first

// Easy way
