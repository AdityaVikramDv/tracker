const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and models

const empSchema = new Schema({
    name: String,
    empId: Number,
    email: String,
    role: String,
    team: String,
    ra: String,
    permissions: String,
    mobile: Number,
    authcode: String,
    gender: String,
    leavesTaken: String,
    leavesApplied: String,
    LeavesToBeApplied: String,
    LeavesToBeAppliedCount: Number
});

const Associate = mongoose.model('associates', empSchema);

module.exports = Associate;