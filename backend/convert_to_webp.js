// Script chuyển đổi ảnh jpg/png sang webp trong thư mục uploads
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const uploadsDir = path.join(__dirname, "uploads");

fs.readdir(uploadsDir, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const inputPath = path.join(uploadsDir, file);
      const webpPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      if (!fs.existsSync(webpPath)) {
        sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(webpPath)
          .then(() =>
            console.log(`Converted: ${file} -> ${path.basename(webpPath)}`)
          )
          .catch((err) => console.error(`Error converting ${file}:`, err));
      }
    }
  });
});
