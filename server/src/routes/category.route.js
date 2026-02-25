const express = require("express");
const router = express.Router();
const {
	getCategories,
	createCategory,
	deleteCategory,
	importCategories,
	updateCategory
} = require("../controllers/category.controller");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getCategories).post(protect, admin, createCategory);

// Route Import dữ liệu (Đặt TRƯỚC route /:id để tránh conflict)
// POST http://localhost:5000/api/category/import
router.route("/import").post(protect, admin, importCategories);

router.route("/:id")
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
