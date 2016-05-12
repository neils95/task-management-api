var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js'); //accessing our database

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];

//express parses any request
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


//GET request for all todos at URL /todos?completed=true&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where ={};
	// //Filter todo tasks by completion
	if (query.hasOwnProperty('completed')&&query.completed==='true') {
		where.completed=true;
	}else if(query.hasOwnProperty('completed')&&query.completed==='false'){
		where.completed=false;
	}

	if(query.hasOwnProperty('q') && query.q.length>0){
		where.description ={
			$like:'%'+query.q+'%'
		}
	}

	db.todo.findAll({where:where}).then(function(todos){
		return res.json(todos);
	},function(e){
		return res.status(404).json(e);
	});
});

//GET request for individual todos at URL /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			return res.status(200).json(todo.toJSON());
		} else {
			return res.status(404).send();
		}
	}, function(e) {
		return res.status(404).json(e);
	});
});

//POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	body.description = body.description.trim();


	db.todo.create(body).then(function(todo) {
		return res.status(200).json(todo.toJSON());
	}, function(e) {
		return res.status(404).json(e);
	});
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); //finding id ot be deleted
	
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			todo.destroy();
			return res.json(todo.toJSON());
		} else {
			return res.status(404).send();
		}
	}, function(e) {
		return res.status(404).json(e);
	});

	// if (matchedTodo != undefined) {
	// 	todos = _.without(todos, matchedTodo);
	// 	return res.json(matchedTodo);
	// }
	// res.status(404).json({
	// 	"Error": "No todo found with that id"
	// });
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); //clean object provided to include only description and completed

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (!matchedTodo) {
		return res.status(404).json({
			"Error": "No todo found with that id"
		});
	}

	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) { //check if it has valid completed property
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && (body.description.trim().length > 0)) { //check if it has valid description property
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	//EXTEND _ property
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});


db.sequelize.sync().then(function() {
	//start our server
	app.listen(PORT, function() {
		console.log('Express listening on port number ' + PORT + '!');
	});
});