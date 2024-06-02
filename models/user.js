const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, 'Must provide a User Name !'],
        trim: true,
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
    email : {
        type: String,
        required : [true, 'Must provide an email ! '],
        trim : true,
        maxlength : [40, 'email can not be more than 40 characters ! ']
    },
    phonenumber : {
        type: String,
        required : [true, 'Must provide a phone number !'],
        trim: true,
        length: [8, 'phone number has to be composed out of 8 digits ! ']
    },
    profile_picture : {
        type: String,
        default : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    isactive: {
        type: Boolean,
        default: false
    },
    last_time_active: {
        type: Date,
        default: Date.now,
        required: false
    }
})

module.exports = mongoose.model('User', UserSchema);