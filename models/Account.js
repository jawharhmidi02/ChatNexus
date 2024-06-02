const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, 'Must provide a User Name !'],
        trim: true,
    },
    phonenumber : {
        type: String,
        required : [true, 'Must provide a phone number !'],
        trim: true,
        length: [8, 'phone number has to be composed out of 8 digits ! ']
    },
    password : {
        type: String,
        required : [true, 'Must provide a password ! '],
        trim: true,
        minlength: [8, 'password can not be less than 8 characters !']
    },
    first_name : {
        type: String,
        required : [true, 'Must provide a First name ! '],
        trim : true,
        minlength: [1, 'First name can not be less than 1 characters ! '],
        maxlength: [40, 'First name can not be more than 40 characters ! ']
    },
    last_name : {
        type: String,
        required : [true, 'Must provide a Last name ! '],
        trim : true,
        minlength: [1, 'Last name can not be less than 1 characters ! '],
        maxlength: [40, 'Last name can not be more than 40 characters ! ']
    },
    email: {
        type: String,
        required : [true, 'Must provide an email ! '],
        trim : true,
        maxlength : [40, 'email can not be more than 40 characters ! ']
    },
    profile_picture : {
        type: String,
        default : ''
    },
    conversations: {
        type: Array,
        default : [],
        required: false
    }
})

module.exports = mongoose.model('Account', AccountSchema);