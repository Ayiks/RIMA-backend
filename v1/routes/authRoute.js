const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", authController.login);

router.post("/signup", upload.single('profilePic'), authController.signup);

module.exports = router;
