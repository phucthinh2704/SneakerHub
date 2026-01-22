const slugify = require("slugify");
const slugifyUtil = (text) => {
	return slugify(text, { lower: true, strict: true });
};
module.exports = slugifyUtil;