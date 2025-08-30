import { createFungible, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { WalletContextState } from "@solana/wallet-adapter-react";
import axios from "axios";
import { PinataSDK } from "pinata";

//Final Code
const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_GATEWAY_URL
})

export const createToken = async (wallet: WalletContextState, symbol: string, name: string, file: File | null, decimal: number, isMutable: boolean | undefined, description: string | null) => {
    const handleUpload = async (): Promise<string | null> => {
        let metadataLink: string | null = null;

        try {
            const response = await axios.get('http://localhost:8787/presigned_url');
            const presignedUrl = response.data.url;
            let ipfsFileLink: string | undefined;
            if (file) {
                const fileUploadResponse = await pinata.upload.public.file(file).url(presignedUrl);
                if (!fileUploadResponse.cid) {
                    console.error("File upload failed");
                } else {
                    ipfsFileLink = await pinata.gateways.public.convert(fileUploadResponse.cid);
                }
            }
            const metadata = {
                name,
                symbol,
                ...(description && { description }),
                ...(ipfsFileLink && { image: ipfsFileLink }),
            };

            const metadataUploadResponse = await pinata.upload.public.json(metadata).url(presignedUrl);
            if (!metadataUploadResponse.cid) {
                console.error("Metadata upload failed");
            } else {
                metadataLink = await pinata.gateways.public.convert(metadataUploadResponse.cid);
            }
        } catch (err) {
            console.error("Error occurred during upload:", err);
        }

        return metadataLink;
    };


    const umi = createUmi("https://api.devnet.solana.com")
        .use(mplTokenMetadata())
        .use(mplToolbox());

    umi.use(walletAdapterIdentity(wallet))

    const metadaUri = await handleUpload();
    if (!metadaUri) {
        console.error("Something went wrong");
        return;
    }

    const userPubKey = publicKey(wallet.publicKey!);
    const mintAccount = generateSigner(umi)
    const createMintIx = await createFungible(umi, {
        mint: mintAccount,
        symbol,
        name,
        updateAuthority: userPubKey,
        creators: [{ address: userPubKey, verified: true, share: 100 }],
        isMutable,
        uri: metadaUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
        sellerFeeBasisPoints: percentAmount(0),
        decimals: decimal // set the amount of decimals you want your token to have.
    })

    await createMintIx.sendAndConfirm(umi);
    return mintAccount.publicKey;
}