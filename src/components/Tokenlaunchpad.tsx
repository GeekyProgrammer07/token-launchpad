import { useState } from "react";

export function TokenLaunchpad() {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [image, setImage] = useState("");
    const [initialSupply, setInitialSupply] = useState(0);

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
                    onClick={() => { }}
                    className="w-full py-3 rounded-lg bg-violet-200 text-black font-semibold hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                >
                    Create Token
                </button>

            </div>
        </div>
    );
}
