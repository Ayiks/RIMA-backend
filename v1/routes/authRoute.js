const express = require("express");
const jwt = require("jsonwebtoken");
const DriverInfo = require("../models/driverInfo");
const User = require("../models/user");
const multer = require('multer')

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    // Find the user with the given email address
    const user = await User.findOne({ email: req.body.email });

    // If the user is not found, return an error response
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(req.body.password);

    // If the password is not correct, return an error response
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the login is successful, create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token in the response
    res.json({ token });
  } catch (err) {
    next(err);
  }
});


const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.single('profilePic'), async (req, res, next) => {
  try {
    // Check if the email address is already registered
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email address already registered" });
    }

    // Create a new user object
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    });
    
    if (req.file) {
        user.profilePic.data = req.file.buffer;
        user.profilePic.contentType = req.file.mimetype;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    // Save the user to the database
    await user.save();

    // if the user is a driver, create a new driver record and link it to the user
    if (role === "driver") {
      const driver = new DriverInfo({
        user: user._id,
        profilePic: req.body.profilePic,
        vehicleNumber: req.body.vehicleNumber,
        vehichleColor: req.body.vehichleColor,
        vehicleMake: req.body.vehicleMake,
      });
      await driver.save();
    }

    // Create a JWT token with the user ID and role as payload
    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token to the client
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
