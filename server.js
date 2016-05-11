var express =require('express');
var bodyParser =require('body-parser');
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
	todos.forEach(function(todo){
		if(todo.id === todoId){
			 res.json(todo);
		}
	});

	//if not found send error status
	res.status(404).send();
});


//POST /todos
app.post('/todos',function(req,res){
	var body = req.body;
	console.log('description: '+body.description);
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT,function(){
	console.log('Express listening on port number ' + PORT+'!');
});


