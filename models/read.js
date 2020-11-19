const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readSchema = new Schema({
    user: {
        type: String,
        required:true
    },
    event_type: {
        type: String,
        required:false
    },
    book: {
        type: String,
        required:true
    },
    timeStamp: {
        type: Date,
        required: true,
        default: Date.now()
    }
});
module.exports  = mongoose.model("READ", readSchema);