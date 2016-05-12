var Sequelize = require('Sequelize');

//instance of Sequalize
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});
var db={};
//sequlize.import allows to load 
db.todo =sequelize.import(__dirname+'/models/todo.js');
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;
