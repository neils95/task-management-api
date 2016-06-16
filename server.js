var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js'); //accessing our database
var bcrypt = require('bcryptjs');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];

//express parses any request
app.use(bodyParser.json());

app.get('/', middleware.requireAuthentication, function(req, res) {
	res.send('Todo API Root');
});

//GET request for all todos at URL /todos?completed=true&q=work
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var query = req.query;
	var where = {
		userId: req.user.get('id')
	};

	//req.user.get(id), get all todos where user id is 

	// //Filter todo tasks by completion
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		}
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		return res.json(todos);
	}, function(e) {
		return res.status(404).json(e);
	});
});

//GET request for individual todos at URL /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findOne({
		where: {
			userId: req.user.get('id'),
			id: todoId
		}
	}).then(function(todo) {
		//found the correct todo
		if (todo) {
			return res.status(200).json(todo.toJSON());
		} else {
			return res.status(400).send();
		}
	}, function() {
		//todo does not exist
		return res.status(400).send();
	});
});

//POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	body.description = body.description.trim();

	db.todo.create(body).then(function(todo) {

		req.user.addTodo(todo).then(function() {
			return todo.reload();
		}).then(function(todo) { //update version of todo
			return res.status(200).json(todo.toJSON());
		});
	}, function(e) {
		return res.status(404).json(e);
	});
});

//DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10); //finding id ot be deleted

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id') //add user id
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted >= 1) {
			return res.status(204).send();
		} else {
			return res.status(401).json({
				error: 'No todo with id'
			});
		}
	}, function(e) {
		return res.status(500).json(e);
	});
});

//PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); //clean object provided to include only description and completed
	var todoId = parseInt(req.params.id, 10);
	var attributes = {};

	if (body.hasOwnProperty('completed')) { //check if it has valid completed property
		attributes.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) { //check if it has valid description property
		attributes.description = body.description;
	}

	//findone with where clause, return ids where 
	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				return res.json(todo.toJSON());
			}, function(e) {
				return res.status(400).json(e);
			});
		} else {
			return res.status(404).send();
		}
	}, function() {
		return res.status(500).send();
	});

});

//POST /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		return res.status(200).json(user.toPublicJSON());

	}, function(e) {
		return res.status(400).json(e.errors.message);
	});
});

//POST/users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication');
		userInstance = user;
		return db.token.create({
			token: token
		});
		// if (token) {
		// 	res.header('Auth', token).json(user.toPublicJSON()); //header thakes key and value
		// } else {
		// 	res.status(401).send();
		// }

	}).then(function(tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON);
	}).catch(function() {
		res.status(401).send();
	});
});

//DELTE/users/login
app.delete('/users/login',middleware.requireAuthentication,function(req,res){
	req.token.destroy().then(function(){
		res.status(204).send();
	}).catch(function(){
		res.status(500).send();
	});
});

db.sequelize.sync({
	force: true
}).then(function() {
	//start our server
	app.listen(PORT, function() {
		console.log('Express listening on port number ' + PORT + '!');
	});
});