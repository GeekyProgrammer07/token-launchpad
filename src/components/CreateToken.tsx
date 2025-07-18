import { createFungible, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { createGenericFile, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import axios from "axios";
// import * as fs from 'fs';

export const createToken = async (wallet: WalletContextState) => {
    const umi = createUmi("https://api.devnet.solana.com")
        .use(mplTokenMetadata())
        .use(mplToolbox());

    umi.use(walletAdapterIdentity(wallet))

    //Uploading the Image file
    // const imageFile = fs.readFileSync('../assets/token_image.png');

    // const umiImageFile = createGenericFile(imageFile, 'token_image.png', {
    //     tags: [{ name: 'contentType', value: 'image/png' }],
    // })
    // let price = await umi.uploader.getUploadPrice([umiImageFile]);
    // console.log("Estimated Price: ", price);
    // console.log("Uploading image to Arweave via Irys");
    // const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    //     throw new Error(err)
    // })
    // console.log("Image Uploaded Successfully");

    // //Uploading the Metadata
    // const metadata = {
    //     name: "Keemto",
    //     symbol: "KIT",
    //     description: "The Kitten Coin is a token created on the Solana blockchain",
    //     image: imageUri[0],
    // };
    // console.log("Uploading metadata to Arweave via Irys");
    // const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    //     throw new Error(err);
    // });
    // console.log("Metadata Uploaded Successfully");

    const response = await axios.get('http://localhost:3000/upload');
    const metadataUri = response.data.metadataUri;

    const mintAccount = generateSigner(umi)
    const createMintIx = await createFungible(umi, {
        mint: mintAccount,
        symbol: 'KIT',
        name: 'The Kitten Coin',
        // creators: [{ address: wallet.publicKey, verified: true, share: 100 }],
        isMutable: true,
        uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
        sellerFeeBasisPoints: percentAmount(0),
        decimals: 9, // set the amount of decimals you want your token to have.
    })

    //Finally Creating the token
    const token = await createMintIx.sendAndConfirm(umi);
    console.log("Final Transaction Signature: ", token.signature);
    return mintAccount.publicKey;
}

// (async () => {
//     // Getting Keypair from secret key
//     const payer = Uint8Array.from([123, 209, 0, 202, 217, 181, 147, 18, 170, 131, 174,
//         77, 90, 62, 88, 164, 197, 55, 113, 128, 13, 144,
//         69, 178, 76, 1, 90, 154, 153, 228, 66, 144, 50,
//         44, 57, 191, 91, 44, 61, 188, 237, 222, 58, 0,
//         4, 183, 65, 155, 175, 128, 187, 118, 147, 158, 186,
//         147, 0, 4, 13, 107, 48, 221, 144, 149]);

//     const umi = createUmi("https://api.devnet.solana.com")
//         .use(mplTokenMetadata())
//         .use(mplToolbox())
//         .use(irysUploader());

//     const myKeypair = umi.eddsa.createKeypairFromSecretKey(payer);
//     umi.use(walletAdapterIdeb(myKeypair));

//     //Getting the image from the filesystem and getting the URI
//     const imageFile = fs.readFileSync('./assets/token_image.png')
//     const umiImageFile = createGenericFile(imageFile, 'token_image.png', {
//         tags: [{ name: 'contentType', value: 'image/png' }],
//     })

//     //Safety May Be
//     // await umi.rpc.refresh(); // fetch latest blockhash & context

//     let price = await umi.uploader.getUploadPrice([umiImageFile]);
//     console.log("Estimated Price: ", price);
//     console.log("Uploading image to Arweave via Irys");
//     const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
//         throw new Error(err)
//     })
//     console.log("Image Uploaded Succefully");

//     //Creating the metadata and getting the URI
//     const metadata = {
//         name: "Keemto",
//         symbol: "KIT",
//         description: "The Kitten Coin is a token created on the Solana blockchain",
//         image: imageUri[0],
//     };
//     console.log("Uploading metadata to Arweave via Irys");
//     const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
//         throw new Error(err);
//     });
//     console.log("Metadata URI: ", metadataUri);



//     const mintAccount = generateSigner(umi)
//     const createMintIx = await createFungible(umi, {
//         mint: mintAccount,
//         symbol: 'KIT',
//         name: 'The Kitten Coin',
//         creators: [{ address: myKeypair.publicKey, verified: true, share: 100 }],
//         isMutable: true,
//         uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
//         sellerFeeBasisPoints: percentAmount(0),
//         decimals: 9, // set the amount of decimals you want your token to have.
//     })
//     console.log(createMintIx);

//     //Finally Creating the token
//     const token = await createMintIx.sendAndConfirm(umi);
//     console.log("Final Transaction Signature: ", token.signature);
// })();