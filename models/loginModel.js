const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and models

const authSchema = new Schema({
    username: String,
    password: String,
    empId: Number,
    role: String,
    team: String

});

const authModel = mongoose.model('authcollection', authSchema);

module.exports = authModel;