const mongoose = require('mongoose');
const{Schema, model} = mongoose;

const vehicleInfoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    
    vehicleNumber:{
        type:String
    },
    vehichleColor:{
        type:String
    },
    vehicleMake:{
        type:String
    },
    vehicleModel:{
        type:String
    },
    insured:{
        type:Boolean,
        default: false
    },
    insuranceExpiryDate:{
        type:Date
    },
    qrType:{
        type:String
    }
})

const VehicleInfo = model('VehicleInfo', vehicleInfoSchema);

module.exports = VehicleInfo;