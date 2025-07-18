import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createGenericFile } from "@metaplex-foundation/umi";
import cors from "cors";

const umi = createUmi("https://api.devnet.solana.com").use(irysUploader());

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get("/upload", async (req, res) => {
    try {

        const imagePath = path.resolve(__dirname, "../assets/token_image.png");
        const imageFile = fs.readFileSync(imagePath);
        const umiImageFile = createGenericFile(imageFile, "token_image.png", {
            tags: [{ name: "contentType", value: "image/png" }],
        });

        console.log("Uploading image to Arweave via Irys...");
        const imageUri = await umi.uploader.upload([umiImageFile]);
        console.log("Image Uploaded:", imageUri[0]);

        // 5. Prepare metadata
        const metadata = {
            name: "Keemto",
            symbol: "KIT",
            description: "The Kitten Coin is a token created on the Solana blockchain",
            image: imageUri[0],
        };
        console.log("Uploading metadata...");
        const metadataUri = await umi.uploader.uploadJson(metadata);
        console.log("Metadata Uploaded:", metadataUri);

        return res.json({
            metadataUri: metadataUri[0],
        });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: error.message || "Upload failed" });
    }
});

app.get('/', (_, res) => {
    res.send("Hello From Server");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
