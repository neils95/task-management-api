var express =require('express');
var bodyParser =require('body-parser');
var _ =require('underscore');

var app =express();
var PORT =process.env.PORT||3000;
var todos =[];
var todoNextId=1;

//express parses any request
app.use(bodyParser.json());

//GET request for all todos at URL /todos----------------------------
app.get('/todos',function(req,res){
	return res.json(todos);
});


//GET request for individual todos at URL /todos/:id
app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);

	var matchedTodo = _.findWhere(todos,{id:todoId});
	if(matchedTodo===undefined){
		res.status(404).send();
	}else{
		res.json(matchedTodo);
	}
	//if not found send error status
	
});


//POST /todos
app.post('/todos',function(req,res){
	var body = _.pick(req.body,'description','completed');

	//use _.pick to only keep description and completed
	//update body.description with trimmer value


	if(!_.isBoolean(body.completed)|| !_.isString(body.description)||body.description.trim().length===0){
		return res.status(400).send();
	}

	var body = _.pick(body,'description','completed');
	body.description = body.description.trim();

	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT,function(){
	console.log('Express listening on port number ' + PORT+'!');
});


