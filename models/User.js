const mongoose = require('mongoose');


// Define a schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
   
});


// Compile model from schema
const User = mongoose.model('User', userSchema);


module.exports = User;




