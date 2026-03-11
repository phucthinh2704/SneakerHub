require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");

// Import Models
const Product = require("./models/Product");
const Brand = require("./models/Brand");
const Category = require("./models/Category");
const User = require("./models/User");

// --- 1. KẾT NỐI MONGODB ---
// mongoose.connect("mongodb+srv://thinhphuc2704_db_user:9nxgZ4bySYi3OuZb@cluster0.zylawbc.mongodb.net/sneaker-hub", {});
mongoose.connect("mongodb://localhost:27017/sneaker-hub", {});

// --- 2. HÀM IMPORT DỮ LIỆU ---
const importData = async () => {
    try {
        console.log("⏳ Đang đọc file product.json...");
        
        // Đọc dữ liệu từ file JSON
        const productsRaw = JSON.parse(
            fs.readFileSync(`${__dirname}/data/product.json`, "utf-8")
        );

        console.log("⏳ Đang chuẩn bị dữ liệu...");

        // A. Lấy Admin User (Để gán người tạo sản phẩm)
        const adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            console.error("❌ LỖI: Không tìm thấy Admin User nào. Vui lòng tạo User admin trong database trước.");
            process.exit(1);
        }
        const adminId = adminUser._id;

        // B. Lấy Map Brand (Slug -> ID) để tra cứu nhanh
        const brands = await Brand.find({});
        const brandMap = {};
        brands.forEach(b => {
            brandMap[b.slug] = b._id;
        });

        // C. Lấy Map Category (Slug -> ID) để tra cứu nhanh
        const categories = await Category.find({});
        const categoryMap = {};
        categories.forEach(c => {
            categoryMap[c.slug] = c._id;
        });

        // D. Xử lý danh sách sản phẩm (Map ID thật vào)
        const finalProducts = productsRaw.map(product => {
            // Tìm Brand ID từ Slug
            const brandId = brandMap[product._brandSlug];
            if (!brandId) {
                console.warn(`⚠️ Cảnh báo: Không tìm thấy Brand slug '${product._brandSlug}' cho sản phẩm '${product.name}'`);
            }

            // Tìm Category ID từ Slug
            const categoryId = categoryMap[product._categorySlug];
            if (!categoryId) {
                console.warn(`⚠️ Cảnh báo: Không tìm thấy Category slug '${product._categorySlug}' cho sản phẩm '${product.name}'`);
            }

            // Trả về object Product hoàn chỉnh
            return {
                ...product,
                user: adminId,
                brand: brandId,
                category: categoryId,
                // Xóa các trường helper (slug tạm)
                _brandSlug: undefined,
                _categorySlug: undefined
            };
        });

        // E. Xóa dữ liệu cũ và Insert mới
        await Product.deleteMany(); // Xóa sạch bảng Product cũ
        console.log("🗑️  Đã xóa dữ liệu Product cũ.");

        await Product.insertMany(finalProducts);
        console.log("✅ Đã import thành công Product!");

        process.exit();
    } catch (error) {
        console.error("❌ Lỗi Import:", error);
        process.exit(1);
    }
};

// --- 3. HÀM XÓA DỮ LIỆU (Optional) ---
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log("🗑️  Đã xóa sạch dữ liệu Product!");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi Delete:", error);
        process.exit(1);
    }
};

// --- 4. CHẠY SCRIPT ---
// Chạy: node seeder.js -d (để xóa)
// Chạy: node seeder.js (để import)
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}