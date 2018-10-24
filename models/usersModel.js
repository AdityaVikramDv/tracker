const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and models

const userSchema = new Schema({
    username: String,
    password: String,
    empId: Number,
    email: String,
    role: String,
    superTeam: String,
    teamName: String,
    requirementArea: String,
    mobile: Number,
    gender: String,
    zone: Number,
    odc: String,
    branch: String

});

const User = mongoose.model('users', userSchema);

module.exports = User;