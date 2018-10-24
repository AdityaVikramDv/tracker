const mongoose = require('mongoose');

//ES6 Promises
mongoose.Promise = global.Promise;


//connect to mongo db
mongoose.connect("mongodb://localhost/myDb");
mongoose.connection.once('open', function () {
    console.log("************ connection established To local DB**********");
}).on('error', function (error) {
    console.log("Connection error occurred due to :", error);
});