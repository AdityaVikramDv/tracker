const mongoose = require('mongoose');
const mocha = require('mocha');
const assert = require('assert');
const Associate = require('../models/empModel');


before(function (done) {
    //connect to mongo db
    mongoose.connect("mongodb://localhost/myDb");
    mongoose.connection.once('open', function () {
        console.log("************ connection established in test cases  **********");
        done();
    }).on('error', function (error) {
        console.log("Connection error occurred due to :", error);
    });
});


describe(" Add records to the DB  ", function () {
    // create TC's

    beforeEach(function (done) {
        mongoose.connection.collections.associatescollections.drop(function () {
            done();
        });
    });
    it("Add a employee record to DB successfully", function (done) {
        var employee = new Associate({
            name: "Aditya Vikram Damerla Veoma",
            empId: 882970,
            email: "adityavikram.dv@tcs.com",
            role: "Team Member",
            teamName: "Dhruva"
        });
        employee.save().then(function () {
            assert(employee.isNew === false);
            done();
        });
    });


});

describe(" Delete records in the DB  ", function () {
    // create TC's

    it("Delete a employee record to DB successfully", function (done) {

        Associate.findOneAndRemove({name: "Aditya Vikram Damerla Veoma"}).then(function () {
            Associate.findOne({name: "Aditya Vikram Damerla Veoma"}).then(function (result) {
                assert(result === null);
            });
            done();
        });
    });


});