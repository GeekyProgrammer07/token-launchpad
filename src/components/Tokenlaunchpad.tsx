import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { createToken } from "./CreateToken";

export function TokenLaunchpad() {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [image, setImage] = useState<File | null>(null);
    // const [initialSupply, setInitialSupply] = useState(0);
    const [decimal, setDecimal] = useState(0);
    const [token, setToken] = useState("");
    const [isMutable, setIsMutable] = useState<boolean | undefined>()
    const [description, setDescription] = useState<string|null>(null);

    const wallet = useWallet();

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
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-violet-600 file:text-white file:hover:bg-indigo-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <input
                    type="number"
                    placeholder="Decimals"
                    value={decimal}
                    onChange={(e) => setDecimal(Number(e.target.value))}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* <input
                    type="number"
                    placeholder="Initial Supply"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(Number(e.target.value))}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                /> */}

                <select
                    value={isMutable === undefined ? '' : isMutable.toString()}
                    onChange={(e) => setIsMutable(e.target.value === 'true')}
                    className="block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="" disabled>isMutable</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <input
                    type="text"
                    placeholder="Description"
                    value={description === null ? "" : description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    onClick={async () => {
                        const tokenPubKey = await createToken(wallet,symbol,name,image,decimal,isMutable,description);
                        setToken(tokenPubKey!);
                    }}
                    className="w-full py-3 rounded-lg bg-violet-200 text-black font-semibold hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                >
                    Create Token
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
