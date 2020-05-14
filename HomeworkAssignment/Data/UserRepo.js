const User = require('../Models/User');

class UserRepo {
    UserRepo() {        
    }

    async getUserByEmail(email) {
        var user = await User.findOne({email: email});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }
    async allUsers() {
        let users = await User.find().exec();
        return   users;
    }
    async getUser(username) {
        let user = await User.findOne({username:username}).exec();
        return   user;
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
            let userObject = await this.getUser(editedObj.username);

            // Check if movie exists.
            if(userObject) {

                // Movie exists so update it.
                let updated = await User.updateOne(
                    { username: editedObj.username}, // Match id.

                    // Set new attribute values here.
                    {$set: {firstName: editedObj.firstName,lastName:editedObj.lastName,email:editedObj.email }});

                // No errors during update.
                if(updated.nModified!=0) {
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    respons.errorMessage =
                        "An error occurred during the update. The item did not save."
                }
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
    };

}
module.exports = UserRepo;

