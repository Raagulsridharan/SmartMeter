
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create reading schema & model
const AlertSchema = new Schema({
    deviceId: {
        type: String,
    },
    unitLimit: {
        type: Number,
        default: 0
    },
    isSent: {
        type: Boolean,
        default: false
    },
    sentDate:{
        type: Date,
        default: null
    }
});
const Alert = mongoose.model('alert', AlertSchema);
module.exports = Alert;