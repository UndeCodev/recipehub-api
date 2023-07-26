import fs from 'fs-extra'
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: "public_A6I8X3UHDsBJ6zmib8Qxd1R/L7A=",
    privateKey: "private_YaFXvXVhEbA8t8nWPVpbz070Ljg=",
    urlEndpoint: "https://ik.imagekit.io/ooasyrel0"
});

export const uploadImage = async({ folder, filePath, fileName }) => {
    const file = await fs.readFile(filePath)

    return await imagekit.upload({
        folder,
        file,
        fileName,
    })
}

