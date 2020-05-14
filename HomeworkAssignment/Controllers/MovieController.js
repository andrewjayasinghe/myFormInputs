const MovieRepo   = require('../Data/MovieRepo');
const UserRepo = require('../Data/UserRepo')
const _movieRepo  = new MovieRepo();
const _userRepo = new UserRepo();
const Movie       = require('../Models/Movies');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');

// This is the default page for domain.com/product/index.
// It shows a listing of products if any exist.
exports.Index = async function(request, response){
    let movies = await _movieRepo.allMovies();
    if(movies!= null) {
        let reqInfo = RequestService.reqHelper(request);
        response.render('Movies/Index', { movies:movies, reqInfo:reqInfo })
    }
    else {
        response.render('Movies/Index', { movies:[] })
    }
};

// Shows one single object at a time. 
exports.Detail = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    // request.query used to get url parameter.
    let movieID  = request.query._id;
    let movieObj = await _movieRepo.getMovie(movieID);
    response.render('Movies/Detail', { movie:movieObj, reqInfo:reqInfo });
};

// Displays 'edit' form and is accessed with get request.
exports.Edit = async function(request, response) {
    let movieID  = request.query._id;
    console.log(movieID);
    let movieObj = await _movieRepo.getMovie(movieID);
    let reqInfo = RequestService.reqHelper(request);
    if(reqInfo.authenticated) {
        response.render('Movies/Edit', {movie:movieObj, errorMessage:"", reqInfo:reqInfo});
    }
    else {
        response.redirect('/User/Login?errorMessage=You ' +
            'must be logged in to view this page.')
    }

};

// Receives posted data that is used to update the item.
exports.Update = async function(request, response) {
    let movieID = request.body._id;
    let reqInfo = RequestService.reqHelper(request);
    console.log("The posted movie id is: " + movieID +" "+ reqInfo.username );
    let review = request.body.review;
    let rating = request.body.rating;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let name = reqInfo.username;

    let newArrayObj = {  review:review, rating:rating, date:date, user:name,};

    // Parcel up data in a 'Movie' object.
    let tempMovieObj  = new Movie( {
        _id: movieID,
        author: newArrayObj
    });

    // Call update() function in repository with the object.
    let responseObject = await _movieRepo.update(tempMovieObj);


    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        
        response.render('Movies/Updated', { movie:responseObject.obj,
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log(JSON.stringify(responseObject.errorMessage));
        response.render('Movies/Edit', { 
            movie:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,reqInfo:reqInfo });
    }
};

// This function receives an id when it is posted. 
// It then performs the delete and shows the movie listing after.
// A nicer (future) version could take you to a page to confirm the deletion first.
exports.Delete = async function(request, response) {
    let id           = request.body._id;
    let deletedItem  = await _movieRepo.delete(id);
    let reqInfo = RequestService.reqHelper(request);

    // Some debug data to ensure the item is deleted.
    console.log(JSON.stringify(deletedItem));
    let movies     = await _movieRepo.allMovies();
    response.render('Movies/Index', {movies:movies, reqInfo:reqInfo});
};

exports.myReviews = async function(request, response){
    let reqInfo = RequestService.reqHelper(request);
    let userID = reqInfo.username;
    let user = await _userRepo.getUser(userID);
    let movies = await _movieRepo.allMovies();
    if(user!= null && movies != null) {
        response.render('Movies/MyReviews', {movies:movies,user:user, reqInfo:reqInfo})
    }
    else {
        response.render('Movies/Index', {movies:[] })
    }
};


