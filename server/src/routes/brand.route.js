const express = require("express");
const router = express.Router();
const {
	getBrands,
	createBrand,
	importBrands,
	updateBrand,
	deleteBrand,
} = require("../controllers/brand.controller");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getBrands).post(protect, admin, createBrand);
router
	.route("/:id")
	.put(protect, admin, updateBrand)
	.delete(protect, admin, deleteBrand);
router.route("/import").post(protect, admin, importBrands);

module.exports = router;
