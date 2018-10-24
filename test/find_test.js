const assert = require('assert');
const Associate = require('../models/empModel');


describe("Find records ", function () {
    // create TC's
    var emp;
    beforeEach(function (done) {
        emp = new Associate({
            name: "sridhar belide"
        });
        emp.save().then(function () {
            assert(emp.isNew === false);
            done();
        });
    });

    it("FIND one record with  employee name sridhar belide in DB ", function (done) {
        Associate.findOne({name: "sridhar belide"}).then(function (result) {
            assert(result.name === 'sridhar belide');
            done();
        });

    });
    it("FIND one record with  employee name sridhar belide in DB ALTERNATE  ", function (done) {
        Associate.findOne({_id: emp._id}).then(function (result) {
            assert(result.name === 'sridhar belide');
            done();
        });

    });

});