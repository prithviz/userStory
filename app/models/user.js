var mongoose = require('mongoose'); // mongodb library
var Schema = mongoose.Schema; //method of mongoose to build schema
var bcrypt = require('bcrypt-nodejs'); // importing password hashing library

//Userschema Object

var UserSchema = new Schema({
    name : String,
    username : { type : String , required : true , index : { unique : true }},
    password : { type : String , required : true , select : false }
});

//Password Hashing snippet using bcrypt(third party library)

UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password,null,null,function (err,hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

//custom method to compaare passwords

UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password , user.password);
};

//dbModule to be export
module.exports = mongoose.model('User',UserSchema);