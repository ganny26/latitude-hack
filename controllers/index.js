'use strict';
var randomID = require("random-id");
var mongoose = require('mongoose');
var multer = require('multer');

mongoose.connect('localhost:27017/test');


var Schema = mongoose.Schema;


//var upload = multer({ dest: __dirname + 'controllers/uploads/' });
//user schema for mongo db
var userDataSchema = new Schema({
    registernumber: { type: String, required: true, default: randomID(5, "0") },
    username: String,
    mobile: String,
    email: String,
    ticket: String,
    srctype: String,
    createdate: { type: Date, required: true, default: Date.now }
}, { collection: 'eventData' });

var UserData = mongoose.model('UserData', userDataSchema);

//all route options
module.exports = function (router) {

    //summary route for admin
    router.get('/summary', function (req, res) {
        UserData.find(function (err, data) {
            if (err) {
                res.status(500);
                res.send('Internal server error');
            }
            else {
                res.status(200);
                res.render('summary', { data: data });
            }
        });
    });

    //get details api route
    router.get('/getdetails', function (req, res) {
        UserData.find(function (err, data) {
            if (err) {
                res.status(500);
                res.send('Internal server error');
            }
            else {
                res.status(200);
                res.json(data);
            }
        });
    });


    //main route
    router.get('/', function (req, res) {
        if(req.session.formdata){
            var formdata = req.session.formdata;
            console.log(req.session.formdata);
            res.render('index',{sessdata: formdata});
        }else{
            res.render('index');
        }
        
    });

    //chart route
    router.get('/chart', function (req, res) {
        res.render('chart');
    });


    //save register details
    router.post('/save', function (req, res) {

        var item = {
            username: req.body.txtName,
            mobile: req.body.txtMobile,
            email: req.body.txtEmail,
            ticket: req.body.txtTicket,
            srctype: req.body.ddType
        };
        var successid;
        var data = new UserData(item);
        data.save(function (err, user) {
            console.log(user._id);
            successid = user._id;
        });
        console.log('successid', successid);
        res.render('save', { doneid: successid });
    });

    //preview register details
    router.post('/preview', function (req, res) {
   
        req.session.formdata = req.body;

        res.render('preview', {
            username: req.body.txtName,
            mobile: req.body.txtMobile,
            email: req.body.txtEmail,
            ticket: req.body.txtTicket,
            srctype: req.body.ddType
        });
    });
};
