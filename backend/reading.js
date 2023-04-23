const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create reading schema & model
const ReadingSchema = new Schema({
    accountId: {
        type: String,
    },
    deviceId: {
        type: String,
    },
    usage: {
        type: Number,
        default: 0
    },
    usedAt: {
        type: Date,
    },
    unitType:{
        type: String,
    }
});
const Reading = mongoose.model('reading', ReadingSchema);
module.exports = Reading;