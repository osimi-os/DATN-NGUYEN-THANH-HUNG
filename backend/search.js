// npm install csv-parser
import fs from 'fs';
import csv from 'csv-parser';

// Đọc dữ liệu từ file CSV
const products = [];
fs.createReadStream('C:/Users/trangdo/Documents/HocTap/TrenLop/co_so_tnnt/BTL/ecommerce-website-AI/modelAI/data/data.csv') // Đường dẫn đến file data.csv
    .pipe(csv())
    .on('data', (row) => {
        products.push(row.Items.toLowerCase()); // Đưa tên sản phẩm vào mảng, chuyển đổi sang chữ thường để so sánh không phân biệt chữ hoa chữ thường
    })
    .on('end', () => {
        // Hàm tạo gợi ý không trùng lặp
        function suggestUniqueProducts(input) {
            input = input.toLowerCase(); // Chuyển đổi chuỗi nhập vào thành chữ thường để so sánh không phân biệt chữ hoa chữ thường
            const suggestions = new Set(); // Sử dụng Set để loại bỏ các sản phẩm trùng lặp
            products.forEach(product => {
                if (product.includes(input)) {
                    suggestions.add(product);
                }
            });
            return Array.from(suggestions); // Chuyển đổi Set thành mảng
        }

        // Ví dụ sử dụng
        const userInput = "and ";
        const suggestedProducts = suggestUniqueProducts(userInput);
        console.log("Gợi ý sản phẩm:", suggestedProducts);
    });
