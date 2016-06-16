var Sequelize = require('sequelize');
//Check if server is deployed on Heroku or locally.
var env = process.env.NODE_ENV || 'development';
var sequelize;

//Check if it is running on heroku or local machine
if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}


var db = {};

//sequlize.import to import models stored in other js files
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user=sequelize.import(__dirname +'/models/user.js');
db.token=sequelize.import(__dirname+'/models/token.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//create associasations
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db;
