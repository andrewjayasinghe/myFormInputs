const User           = require('../Models/User');
var   passport       = require('passport');
const UserRepo   = require('../Data/UserRepo');
const _userRepo  = new UserRepo();
const RequestService = require('../Services/RequestService');

exports.Index = async function(request, response){
    let users = await _userRepo.allUsers();
    if(users!= null) {
        let reqInfo = RequestService.reqHelper(request);
        response.render('User/Index', { username:request.users.username, reqInfo:reqInfo })
    }
    else {
        response.render('User/Index', { users:[] })
    }
};

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            email:        req.body.email,
            username:     req.body.username,
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/User/SecureArea'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
};

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {

  passport.authenticate('local', {
      successRedirect : '/User/Detail',
      failureRedirect : '/User/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated) {
        res.render('User/SecureArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
};

exports.Edit = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let userID  = reqInfo.username;
    console.log(userID);
    let userObj = await _userRepo.getUser(userID);
    response.render('User/Edit', {user:userObj, errorMessage:"", reqInfo:reqInfo});
};
// Receives posted data that is used to update the item.
exports.Update = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let userID = reqInfo.username;
    console.log("The posted user id is: " + userID);

    // Parcel up data in a 'User' object.
    let tempUserObj  = new User( {
        username:     userID,
        firstName:    request.body.firstName,
        lastName:     request.body.lastName,
        email:        request.body.email,

    });

    // Call update() function in repository with the object.
    let responseObject = await _userRepo.update(tempUserObj);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {

        response.render('User/Detail', { user:responseObject.obj,
            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log(JSON.stringify(responseObject.errorMessage));
        response.render('User/Edit', {
            user:      responseObject.obj,
            errorMessage: responseObject.errorMessage });
    }
};
exports.Detail = async function(request, response) {

    let reqInfo = RequestService.reqHelper(request);
    // request.query used to get url parameter.
    let userID  = reqInfo.username;
    let userObj = await _userRepo.getUser(userID);
    response.render('User/Detail', {user:userObj, reqInfo:reqInfo });
};


