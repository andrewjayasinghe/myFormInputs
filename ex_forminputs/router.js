var HomeController = require('./Controllers/HomeController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);    
    app.post('/Home/ReceiveForm', HomeController.ReceiveForm);
};
