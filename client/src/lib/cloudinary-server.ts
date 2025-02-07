import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
});

export async function downloadFromCloudinary(fileUrl: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Downloading file from cloudinary: ", fileUrl);

      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
      });

      const tempFilePath = path.join("/tmp", `cloudinary_${Date.now()}.pdf`);
      const writer = fs.createWriteStream(tempFilePath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        console.log("File saved at: ", tempFilePath);
        resolve(tempFilePath);
      });

      writer.on("error", (error) => {
        console.error("Error saving file: ", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error downloading file from cloudinary: ", error);
      reject(error);
    }
  });
}
