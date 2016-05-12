var express =require('express');
var bodyParser =require('body-parser');
var _ =require('underscore');

var app =express();
var PORT =process.env.PORT||3000;
var todos =[];
var todoNextId=1;

//express parses any request
app.use(bodyParser.json());
app.get('/',function(req,res){
	res.send('Todo API Root');
});
//GET request for all todos at URL /todos----------------------------
app.get('/todos',function(req,res){
	//returns all query parameters as an object
	var queryParams = req.query;
	console.log(queryParams);
	var filteredTodos =todos;

	if(queryParams.hasOwnProperty('completed')){
		if(queryParams.completed==='true'){
			filteredTodos =_.where(todos,{completed:true});
			return res.json(filteredTodos);
		}else if(queryParams.completed ==='false'){
			filteredTodos =_.where(todos,{completed:false});
			return res.json(filteredTodos);
		}else{
			return res.status(400).send();
		}
	}
	//if has property && completed =='true'
	//	filtered todos _.where(filteredTodos, {completed:true});
	//else if has prop and completed is 'false'
	return res.json(filteredTodos);
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

	if(!_.isBoolean(body.completed)|| !_.isString(body.description)||body.description.trim().length===0){
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

//DELETE /todos/:id
//	find the todo to be removed
//	used without method from underscore

app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id,10);					//finding id ot be deleted
	var matchedTodo = _.findWhere(todos,{id:todoId});			//find todo to be deletde
	if(matchedTodo!=undefined){
		todos=_.without(todos,matchedTodo);
		return res.json(matchedTodo);
	}
	res.status(404).json({"Error":"No todo found with that id"});
});

//PUT /todos/:id
app.put('/todos/:id',function(req,res){
	var body = _.pick(req.body,'description','completed');				//clean object provided to include only description and completed

	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos,{id:todoId});
	if(!matchedTodo){
		return res.status(404).json({"Error": "No todo found with that id"});
	}

	var validAttributes={};		

	if(body.hasOwnProperty('completed') &&_.isBoolean(body.completed)){	//check if it has valid completed property
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') &&_.isString(body.description)&&(body.description.trim().length>0)){	//check if it has valid description property
		validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	//EXTEND _ property
	_.extend(matchedTodo,validAttributes);
	res.json(matchedTodo);

});

app.listen(PORT,function(){
	console.log('Express listening on port number ' + PORT+'!');
});


