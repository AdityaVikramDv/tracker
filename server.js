var express = require('express'), app = express(), port = parseInt(process.env.PORT, 10) || 9999;
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const mongoose = require('mongoose');
const Associate = require('./models/empModel');
const authModel = require('./models/loginModel');

//ES6 Promises
mongoose.Promise = global.Promise;

//connect to mongo db
mongoose.connect("mongodb://localhost/eric_db");
mongoose.connection.once('open', function () {
    console.log("************ connecting to local DB **********");
    // Query DB for the default User name and password

    isDbConnected(function () {
        console.log("Connection is LIVE:");
    }.bind(this));

}).on('error', function (error) {
    console.log("Connection error occurred due to :", error);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/src/index.html');

});

function isDbConnected(cb) {
    var checkDbConnectInterval = setInterval(function () {
        console.log("checking db connection ---- ");
        if (mongoose.connection.db) {
            cb();
            clearInterval(checkDbConnectInterval);
        }
    }, 100);
}

app.use(express.static(__dirname + '/src/'));

app.listen(port, function () {
    console.log("Im listening at localhost:", port);
});


function doesMeExist() {
    find('authcollections', {username: "admin"}, function (error, result) {
        if (result && result.length > 0) {
            var authcode = result[0].username + result[0].password.toString();
            find('associates', {authcode: authcode}, function (error, result) {
                if (result && result.length > 0) {
                }
            });
        } else {
            console.log("I got created");
            var me = new authModel({username: 'admin', password: '1989', empId: '1989', role: 'admin'});
            var myProf = new Associate({
                name: 'Dr. Banner',
                empId: 1989,
                email: 'admin@tcs.com',
                role: 'admin',
                team: 'FM',
                ra: 'A&O',
                permissions: 'all',
                mobile: 123456789,
                authcode: 'admin1989'
            });
            me.save();
            myProf.save();
        }
    })
}


function find(name, query, cb) {
    mongoose.connection.db.collection(name, function (err, collection) {
        collection.find(query).toArray(cb);
    });
}

function findOneAndUpdate(collection, query, update, callback) {
    mongoose.connection.db.collection(collection, function (err, collection) {
        collection.findOneAndUpdate(query, {$set: update}).toArray(callback);
    });
}

function findOneAndUpdateUpsert(collection, query, newData, callback) {

    mongoose.connection.db.collection(collection, function (err, collection) {
        collection.findOneAndUpdate(query, {$set: newData}, {upsert: true}, function (err, result) {

            if (err) return response.status(500).send({error: err});
            callback();
        });
    });
}


app.post('/updateemployee', function (req, res) {
    console.log("update triggered");
    var query = req.body.query;
    var dataToUpdate = req.body.update;
    console.log(query);
    console.log(dataToUpdate);
    findOneAndUpdateUpsert('associates', query, dataToUpdate, function () {
        res.status(200).send("successfully saved the dates");
    });
});


app.post('/getuser', function (req, res) {
    isDbConnected(function () {
        find('associates', {empId: req.body.empId}, function (err, result) {
            var profile = result[0];
            res.status(200).send(JSON.stringify(profile));
        });
    });
});


app.post('/getemployee', function (req, res) {
    var query = req.body;
    isDbConnected(function () {
        find('associates', query, function (err, result) {
            if (result && result.length > 0) {
                var profile = result[0];
                res.status(200).send(JSON.stringify(profile));
            }
            else {
                res.status(404).send(JSON.stringify('Query associated Employee Info Not Found'));
            }

        });
    });
});


app.post('/authenticate', function (req, res) {

    var authorised;
    find('authcollections', {username: req.body.cred.username.toString()}, function (err, result) {
        console.log("AUTHENTICATION:", result);
        var access = result[0], authcode = '';
        if (access && access.password === req.body.cred.password) {
            authcode = access.username + access.password;
            authorised = {role: access.role, authcode: authcode, empId: access.empId};
        } else {
            authorised = "invalid";
        }
        res.status(200).send(JSON.stringify(authorised));
    }.bind(this));

});

app.post('/getallassociates', function (req, res) {
    var allInfo = {};
    find('associates', {}, function (error, result) {
        if (result && result.length > 0) {
            result.map(function (user) {
                allInfo[user.empId] = null;
                allInfo[user.name] = null;
                allInfo[user.email] = null;
            });

            res.status(200).send(JSON.stringify(allInfo));
        }
    });
});


app.post("/addemployee", function (req, res) {
    var employee = new Associate(req.body);
    employee.save().then(function () {
        if (employee.isNew === false) {
            res.status(200).send(JSON.stringify("Successfully added " + req.body.name));
        }
    });
});

var roles = [];

function fetchRoles() {
    find('authcollections', {}, function (error, result) {
        console.log("---------------------------------------------");
        if (result && result.length > 0) {
            roles = [];
            result.map(function (user) {
                if (user && user.empId) {
                    roles.push(user.empId.toString());
                }

            })
        }
    });
}


app.post("/admin_add", function (req, res) {

    if (roles.length > 0) {
        var empToCheck = req.body.empId;
        var userExits = roles.indexOf(empToCheck) !== -1;
        if (!userExits) {
            var logger = new authModel(req.body);
            logger.save().then(function () {
                if (logger.isNew === false) {
                    res.status(200).send(JSON.stringify("Successfully added " + req.body.username));
                }
            });
        }
        else {
            res.status(200).send(JSON.stringify("error: " + req.body.username + " Already Exists"));
        }

    }
    else {
        //    res.status(200).send(JSON.stringify(req.body.username + " User already exists"));
    }


});
