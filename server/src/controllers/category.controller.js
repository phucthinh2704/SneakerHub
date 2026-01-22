const Category = require("../models/Category");
const slugify = require("../utils/slugify"); 
const fs = require("fs");
const path = require("path"); 

// --- GET ALL CATEGORIES (Public) ---
const getCategories = async (req, res) => {
  try {
    // Lấy danh mục cha trước, populate danh mục con nếu cần (tùy logic frontend)
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json({ success: true, result: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- CREATE CATEGORY (Admin) ---
const createCategory = async (req, res) => {
  try {
    const { name, image, description, parentId } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Tên danh mục là bắt buộc" });

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) return res.status(400).json({ success: false, message: "Danh mục đã tồn tại" });

    const category = await Category.create({
      name,
      slug: slugify(name),
      image,
      description,
      parentId: parentId || null,
    });

    res.status(201).json({ success: true, message: "Tạo danh mục thành công", result: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- DELETE CATEGORY (Admin) ---
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });

    // (Nâng cao) Kiểm tra xem có sản phẩm nào đang thuộc danh mục này không trước khi xóa
    
    await category.deleteOne();
    res.json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- IMPORT CATEGORY TỪ FILE JSON ---
// POST /api/category/import
const importCategories = async (req, res) => {
  try {
    // 1. Xác định đường dẫn file category.json
    const filePath = path.join(__dirname, "..", "data", "category.json");

    // 2. Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy file dữ liệu category.json" 
      });
    }

    // 3. Đọc file và parse JSON
    const fileData = fs.readFileSync(filePath, "utf-8");
    const categories = JSON.parse(fileData);

    // 4. Xóa dữ liệu cũ (Reset)
    await Category.deleteMany({}); 

    // 5. Chèn dữ liệu mới
    // Lưu ý: MongoDB sẽ tự động chấp nhận _id có sẵn trong file JSON 
    // và dùng nó làm ID chính thức, giúp việc map parentId chính xác.
    await Category.insertMany(categories);

    res.status(201).json({ 
      success: true, 
      message: "Đã import dữ liệu danh mục thành công",
      count: categories.length 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory, importCategories };