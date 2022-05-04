const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true},
    username:{type:String,required:true,minLength:3,maxLength:25,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;