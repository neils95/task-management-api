# Task Management REST API

###1. About the web API ###


###2. Installation ###
  To create a local server on [port 3000](http://localhost:3000/) 
  ```
  1. Clone todo-api repo

  2. In terminal, Navigate to todo-api directory

  3. $node server.js
  ```
###3. npm dependencies ###
  * [**Express**](http://expressjs.com/)
    
    Used to set up routes, respond to HTTP requests and set up custom middleware for authentication of each HTTP request.
  
  * [**Sequelize**](http://docs.sequelizejs.com/en/latest/)
    
    Used to setup, update and query remotely hosted PostgreSQL database which stores users and tasks.
  
  * [**cryptojs**](https://www.npmjs.com/package/crypto-js)
    
    Used to encrypt token for additional security.
  
  * [**chai and mocha**](https://mochajs.org/)
    
    Used to perform unit testing in a TDD approach to develop this app.
  

###4. Endpoint reference ###
While running on local server API root is http://localhost:3000/

API is currently remotely hosted on heroku server at  https://neil-todo-api.herokuapp.com/

| METHOD        | ENDPOINT           | Description  |
| ------------- | ------------- | ----- |
| GET     | / | Root of API |
| GET      | /todos      | Returns all tasks for signed in user  |
| GET | /todos/:id      | Returns task at particular id   |
|POST | /todos | Create a new task|
|DELETE | /todos/:id | Delete task at particular id|
|PUT | /todos/:id | Update task at particular id|
|POST | /users | Create new user|
|POST | /users/login | Login existing user |
|DELETE | /users/login | Logout|


###5. Further improvements ###
  * Currently building an android app to add frontend to the API
  * Add ability to share tasks between multiple users
  * Add token expiry to improve security


