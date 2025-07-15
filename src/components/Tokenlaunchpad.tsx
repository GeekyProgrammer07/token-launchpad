import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export function TokenLaunchpad() {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [image, setImage] = useState("");
    const [initialSupply, setInitialSupply] = useState(0);
    const [token, setToken] = useState("");

    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
    );

    const wallet = useWallet();

    const createToken = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected or not ready");
        }

        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const mintKeypair = Keypair.generate();

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey, 6, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
        );
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        transaction.partialSign(mintKeypair);
        await wallet.sendTransaction(transaction, connection);
        const tokenPubKey = mintKeypair.publicKey.toBase58();
        return tokenPubKey;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Solana Token Launchpad
            </h1>

            <div className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="text"
                    placeholder="Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="number"
                    placeholder="Initial Supply"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(Number(e.target.value))}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    onClick={async () => {
                        const tokenPubKey = await createToken();
                        setToken(tokenPubKey);
                    }}
                    className="w-full py-3 rounded-lg bg-violet-200 text-black font-semibold hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                >
                    Click ME
                </button>

                {token && (
                    <p className="text-white break-all text-center mt-4">
                        Token Mint Address: <span className="font-mono">{token}</span>
                    </p>
                )}


            </div>
        </div>
    );
}
