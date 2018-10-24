const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and models

const authusers = new Schema({
    name: String,
    empId: Number,
    email: String,
    role: String,
    team: String,
    ra: String,
    permissions: String,
    mobile:Number,
    authcode:String
});

const Associate = mongoose.model('auth', empSchema);

module.exports = Associate;