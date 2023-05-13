
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create reading schema & model
const DeviceSchema = new Schema({
    deviceId: {
        type: String,
    },
    deviceName: {
        type: String,
    },
    createdDate:{
        type: Date,
        default: null
    }
});
const Device = mongoose.model('alert', DeviceSchema);
module.exports = Device;