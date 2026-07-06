const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chat.controller");

router.post("/", handleChat);

module.exports = router;