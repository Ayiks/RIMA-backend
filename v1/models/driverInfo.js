const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const driverInfoSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    profilePic:{
        data:Buffer,
        contentType: String
    },
    country:{
        type:String,
        default:'Ghana'
    },
    district:{
        type:String,
    },
    emergencyContact:{
        type:String
    },
    driverUnion:{
        type:String
    }
});

const DriverInfo = model('DriverInfo', driverInfoSchema);

module.exports = DriverInfo;