var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/mpaths';
var db;
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

MongoClient.connect(url, function(err, database) {
  	if(err) throw err;

  	db = database;
});

app.use(express.static('public'));

app.get('/', function (req, res) {
	db.collection('roles', function(err, collection) {
	    collection.find({}).toArray(function(err, items) {
	        res.render('home', {
	        	"roles" : items
  			})
	    })
	})
})

app.get('/getusers', function (req, res) {
	var filter = {"viewdelete" : 0}
	var sortParam = req.query.sort;
	var roleParam = req.query.role;
	var locationParam = req.query.location;
	if (sortParam === undefined) {
		sortParam = "firstname";
	}
	if (locationParam !== undefined) {
		filter.location = {'$regex' : locationParam, '$options' : 'i'};
	}
	if (roleParam !== undefined) {
		filter.roles = {'$regex' : roleParam, '$options' : 'i'};
	}
	db.collection('users', function(err, collection) {
	    collection.find(filter, {sort : sortParam}).toArray(function(err, items) {
	        res.json(items);
	    })
	})
})

app.post('/', function (req, res) {
	if (req.body.firstname && req.body.lastname && req.body.age && req.body.location && req.body.roles)
	{
		var insertDocument = function(db, callback) {
	  		var roles  = '';
	  		if (Array.isArray(req.body.roles)) {
	  			for (var i = 0; i < req.body.roles.length; i++) {
	  				roles += req.body.roles[i];
	  				if (i !== req.body.roles.length - 1) {
	  					roles += ", ";
	  				}
	  			};
	  		} else {
	  			roles = req.body.roles;
	  		}
	   		db.collection('users').insertOne( {
	      		"firstname" : req.body.firstname,
	      		"lastname" : req.body.lastname,
	      		"age" : req.body.age,
	      		"location" : req.body.location,
	      		"roles" : roles,
	      		"viewdelete" : 0,
	   		}, function (err, result) {
	    		console.log("Inserted a document into the users collection.");
	    		callback();
	  		});
		};

		insertDocument(db, function() {
	      	res.redirect('/');
	  	});
	} else {
		res.redirect('/');
	}
})

app.put('/delete', function (req, res) {
	var condition = {_id: new ObjectId(req.body.params.userid)};
	db.collection('users', function(err, collection) {
	    collection.update(
	    	condition,
	    	{$set:{viewdelete : 1}}, 
	    	{multi: false}
	    );
	    res.json({"message":"deleted"});
	})
})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});