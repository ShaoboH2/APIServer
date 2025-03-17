// Load required packages
var mongoose = require('mongoose');
const crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    CityList: [{
        type: String
    }],
    preference: {
        type: Boolean,
        requirted: true
    },
    dateCreated: {
        type: Date,
        default: Date.now 
    }
}, {collection: "Users"});

UserSchema.methods.setPassword = function (password) {
    if (!password) {
        throw new Error("Password is required");
    }

    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 100, 64, "sha256")
        .toString("hex");
};
  
UserSchema.methods.validatePassword = function (password) {
    const hashedPassword = crypto
        .pbkdf2Sync(password, this.salt, 100, 64, "sha256")
        .toString("hex");
    return this.hash === hashedPassword;
};


// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema); 

