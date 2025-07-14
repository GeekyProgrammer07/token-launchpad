import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { TokenLaunchpad } from './components/Tokenlaunchpad';

function App() {
  return (
    <div className="min-h-screen bg-[#242424] text-white p-6">
      <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>

            <div className="max-w-4xl mx-auto p-4">
              <TokenLaunchpad />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App