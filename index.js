var express = require("express"); // Initialisation of Express.js module for Node.js REST Calling
var app = express(); // Express variable
app.use(express.static(__dirname + '/client'));
var util = require('util');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var mongoose = require('mongoose');
var async = require('async');



//********************************************* Loading index.html **************************************************//


app.get('/', function(req, res) {
    res.sendFile('./client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});



//********************************************* Creating a schema for expensemaster table/collection *****************//


var Schema = mongoose.Schema;

// create a schema

var expenseSchema = new Schema({
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String }
});


// we need to create a model using it
var Expense= mongoose.model('expensemaster', expenseSchema);

//********************************************* Start the mongoDB and express server **************************************************//


var database;

// Connection URL
var url = 'mongodb://localhost:27017/expensemanager';

// Use connect method to connect to the server
mongoose.connect(url, function(err, db) {
    //assert.equal(null, err);
    if(err){
        return console.log(err);
    }

    console.log("Connected correctly to mongoDB server");
    database = db;

    app.listen(3000, function() {
        console.log('express server started and listening on port 3000!');
    });

});


//********************************************* Get expenseList **************************************************//


app.post('/getExpenseList', function(req, res) {


    console.log("**************************** /getExpenseList Server log **************************************");

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var categoryList = req.body.selectedCategoryList;


    console.log("Parameter received at server");

    console.log("start Date Range: "+ startDate);
    console.log("end Date Range: "+ endDate);
    console.log("selected Category: "+ categoryList);

    Expense.find({
        date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
        },
        category: {
                $in: categoryList

        }
    }, function (err, docs) {
        console.log("err: "+ util.inspect(err));

        console.log("result "+ util.inspect(docs));
        res.send(docs);
    });

});


//********************************************* Insert expenseList **************************************************//


app.post('/addExpenseList', function(req, res) {


    console.log("**************************** /addExpenseList Server log **************************************");

    var expenseListToAdd = req.body;
    console.log('expenseListToAdd: ' + util.inspect(expenseListToAdd));

    for(var i=0;i<expenseListToAdd.length;i++){

        var obj = expenseListToAdd[i];
        obj.date = new Date(obj.date);
    }


    var onInsert = function(err, docs){
        if (err) {
            console.log('Error occurred while adding expense');
        } else {
            console.log('Expense(s) were successfully added.');
        }

        res.send({error:err,docs:docs});
    };

    Expense.collection.insert(expenseListToAdd, onInsert);


});



//********************************************* Edit expenseList **************************************************//


app.post('/editExpenseList', function(req, res) {


    console.log("**************************** /editExpenseList Server log **************************************");

    var expenseListToEdit = req.body;
    console.log('expenseListToEdit: ' + util.inspect(expenseListToEdit));

    for(var i=0;i<expenseListToEdit.length;i++){

        var obj = expenseListToEdit[i];
        obj.date = new Date(obj.date);
    }

    // for(var i=0;i<expenseListToEdit.length;i++){
    //
    //     var expense = expenseListToEdit[i];
    //
    //     Expense.findByIdAndUpdate(expense._id, expense, function(err, model) {
    //         if (err) {
    //             // logger.error(modelString +':edit' + modelString +' - ' + err.message);
    //             // self.emit('item:failure', 'Failed to edit ' + modelString);
    //             // return;
    //             console.log('Error occurred while editing expense');
    //
    //
    //         }
    //         // self.emit('item:success', model);
    //         console.log('model: ' + util.inspect(model));
    //
    //         console.log('Expense(s) were successfully edited.');
    //
    //     });
    // }



    var done = function(err){

        if(err)
            console.log('Error occurred while editing expense');
        else
            console.log('Expense successfully edited');



    };

    async.each(expenseListToEdit, function (expense, done) {
        Expense.findByIdAndUpdate(expense._id, expense, function(err, model) {
            if (err) {
                console.log('Error occurred while editing expense');
                done(err); // if an error occured, all each is stoped
                return;
            }

            console.log('model: ' + util.inspect(model));
            done();
        });
    }, function (err) {
        // final callback launched after all findByIdAndUpdate calls.
        res.send();

    });





});






