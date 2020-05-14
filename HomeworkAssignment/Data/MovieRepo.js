const Movie = require('../Models/Movies');

class MovieRepo {
    
    // This is the constructor.
    MovieRepo() {        
    }

    // Gets all products.
    async allMovies() {     
        let movies = await Movie.find().exec();
        return   movies;
    }
    

    async getMovie(id) {  
        let movie = await Movie.findOne({_id:id}).exec();
        return   movie;
    }

    
    async update(editedObj) {   
    
        // Set up response object which contains origianl movie object and empty error message.
        let response = {
            obj:          editedObj,
            errorMessage: "" };
    
        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if(error) {
                response.errorMessage = error.message;
                return response;
            } 
    
            // Load the actual corresponding object in the database.
            let movieObject = await this.getMovie(editedObj.id);
    
            // Check if movie exists.
            if(movieObject) {
    
                // Movie exists so update it.
                let updated = await Movie.updateOne(
                    { _id: editedObj.id}, // Match id.

                    // Set new attribute values here.
                    {$push: {author:editedObj.author}});
    
                // No errors during update.
                if(updated.nModified!=0) {
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    respons.errorMessage = 
                        "An error occurred during the update. The item did not save." 
                };
                return response; 
            }
                
            // Movie not found.
            else {
                response.errorMessage = "An item with this id cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }  
    
    async delete(id) {
        console.log("Id to be deleted is: " + id);
        let deletedItem =  await Movie.find({_id:id}).remove().exec();
        console.log(deletedItem);
        return deletedItem;
    }
}
module.exports = MovieRepo;
