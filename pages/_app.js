// all pages get wrapped here --> main entry point
// this is like the whole application / frontend
// swapping out our component for index.js

import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
    return (
        // wrap whole app in moralis provider
        // initialiseonMound: option to hook onto server to
        // add more features to website
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
