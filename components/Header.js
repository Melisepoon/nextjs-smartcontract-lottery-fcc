// cheating way by installing web3UIKit
// moralisAuth is to show that we are not trying to connect to a server
// py/px: y padding x padding
// m1-auto: automatic left padding
import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl"> Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
