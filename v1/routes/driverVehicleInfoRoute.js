const express = require('express');
const driverVehicleInfo = require('../controllers/authController');

const router = express.Router();

router.post("/saveDriverVehicle", driverVehicleInfo.saveDriverInfo);