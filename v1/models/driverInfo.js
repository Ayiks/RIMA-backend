const mongoose = require('mongoose');
const{Schema, model} = mongoose;

const driverInfoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    profilePic:{
        data:Buffer,
        contentType: String
    },
    vehicleNumber:{
        type:String
    },
    vehichleColor:{
        type:String
    },
    vehicleMake:{
        type:String
    }
})

const DriverInfo = model('DriverInfo', driverInfoSchema);

module.exports = DriverInfo;