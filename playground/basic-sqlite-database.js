var Sequelize = require('Sequelize');

//instance of Sequalize
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

//defined a model
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

//sequelize.sync({force:true});
sequelize.sync({
	//force: true
}).then(function() {
	console.log('Everything is synced');
});

Todo.create({
	description:"Call mom",
	completed: true
});

Todo.findById(3).then(function(todo){

	if(todo)console.log(todo.toJSON());
	else console.log('Could not find data');
});

	//fetch a todo item by its id, print its json, else print todo not found




	// Todo.create({
	// 	description: "Take out trash",
	// 	completed: false
	// }).then(function(todo) {
	// 	// console.log('Finished: ');
	// 	// console.log(todo);
	// 	return Todo.create({
	// 		description: "Clean Office",
	// 	});
	// }).then(function() {
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%office%'
	// 			}
	// 		}
	// 	});
	// }).then(function(todos) {
	// 	if (todos) {
	// 		todos.forEach(function(todo) {
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log('No to do find');
	// 	}
	// }).catch(function(e) {
	// 	console.log(e);
	// });

// });