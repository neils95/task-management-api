var express =require('express');
var app =express();
var PORT =process.env.PORT||3000;

//collection is todos, model is any one single one of them.

var todos =[{
	id:1,
	description:'Meet mom for  lunch',
	comlpeted:false
},{
	id:2,
	description :'Got grocery shopping',
	completed: false
},{
	id:3,
	description :'Test',
	completed: true
}];

app.get('/',function(req,res){
	res.send('Todo API Root');
});

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


app.listen(PORT,function(){
	console.log('Express listening on port number ' + PORT+'!');
});


