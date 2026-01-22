const userRouter = require("./user.route");
const brandRouter = require("./brand.route");
const categoryRouter = require("./category.route");
const productRouter = require("./product.route");
const cartRouter = require("./cart.route");
const orderRouter = require("./order.route");
const uploadRouter = require("./upload.route");
const { notFound, errorHandler } = require("../middleware/errorMiddleware");

const initRoutes = (app) => {
	app.use("/api/user", userRouter);
	app.use("/api/brand", brandRouter);
	app.use("/api/category", categoryRouter);
	app.use("/api/product", productRouter);
	app.use("/api/cart", cartRouter);
	app.use("/api/order", orderRouter);

	app.use("/api/upload", uploadRouter);
	app.use(notFound);
	app.use(errorHandler);
};

module.exports = initRoutes;
