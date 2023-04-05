const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); //onlu used for models

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); //this will add username and password fields in our schema

module.exports = mongoose.model('User', UserSchema);