const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User = require("../models/user");
const VehicleInfo = require("../models/vehicleInfo");
const DriverInfo = require("../models/driverInfo");

exports.login = async (req, res, next) => {
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
};


function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

exports.signup = async (req, res, next) => {
  try {
    // Check if the email address is already registered
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email address already registered" });
    }

    // Generate a 4 digit OTP and send it to the phone number
    const OTP = generateOTP();
    const phoneNumber = req.body.phoneNumber;   

     // code to send the OTP to the phone number using Twilio
     client.messages
       .create({
         body: `Your OTP for sign up is ${OTP}`,
         from: 'YOUR_TWILIO_PHONE_NUMBER',
         to: phoneNumber
       })
       .then(message => console.log(message.sid))
       .catch(err => console.log(err));

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

     // Save the user to the database only after OTP verification is successful
     const userOTP = req.body.OTP;
     if (userOTP !== OTP) {
       return res.status(400).json({ message: "Invalid OTP" });
     }
     await user.save();

    // if (user.role === "driver") {
    //   const vehicleData = {
    //     user: user._id,
    //     vehicleNumber: req.body.vehicleNumber,
    //     vehichleColor: req.body.vehichleColor,
    //     vehicleMake: req.body.vehicleMake,
    //     vehicleModel: req.body.vehicleModel,
    //     insured: req.body.insured,
    //     insuranceExpiryDate: req.body.insuranceExpiryDate,
    //     qrType: req.body.qrType,
    //   };
    //   const driverInfoData = {
    //     user: user._id,
    //     profilePic: req.body.profilePic,
    //     country: req.body.country,
    //     district: req.body.district,
    //     emergencyContact: req.body.emergencyContact,
    //     driverUnion: req.body.driverUnion,
    //   };
    //   const vehicle = await VehicleInfo.create(vehicleData);
    //   const driverInfo = await DriverInfo.create(driverInfoData);
    // }

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

}

// POST /driver-info
exports.saveDriverInfo = async (req, res, next) => {
  try {
    // Get the user ID from the authentication token
    const userId = req.user.userId;

    const vehicleData = {
      user: userId,
      vehicleNumber: req.body.vehicleNumber,
      vehichleColor: req.body.vehichleColor,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      insured: req.body.insured,
      insuranceExpiryDate: req.body.insuranceExpiryDate,
      qrType: req.body.qrType,
    };

    const driverInfoData = {
      user: userId,
      profilePic: req.body.profilePic,
      country: req.body.country,
      district: req.body.district,
      emergencyContact: req.body.emergencyContact,
      driverUnion: req.body.driverUnion,
    };

    const vehicle = await VehicleInfo.create(vehicleData);
    const driverInfo = await DriverInfo.create(driverInfoData);

    res.json({ message: "Driver and vehicle info saved successfully" });
  } catch (err) {
    next(err);
  }
}

