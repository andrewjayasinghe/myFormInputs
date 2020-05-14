var HomeController = require('./Controllers/HomeController');
var UserController = require('./Controllers/UserController');
var MovieController = require('./Controllers/MovieController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/Movies/Index',MovieController.Index);
    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/SecureArea', UserController.SecureArea);
    app.get('/', MovieController.Index);
    app.get('/Movies/Detail',MovieController.Detail);
    app.get('/Movies/Edit', MovieController.Edit);
    app.post('/Movies/Update', MovieController.Update);
    app.get('/User/Detail',UserController.Detail);
    app.get('/User/Edit', UserController.Edit);
    app.post('/User/Update', UserController.Update);
    app.get('/Movies/Updated',MovieController.Detail);
    app.get('/Movies/MyReviews',MovieController.myReviews);

};
