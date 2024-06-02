const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true
    },
    nicknames: {
        type: Object
    },
    name: {
        type: String
    },
    profile_picture: {
        type: String
    },
    last_message: {
        type: String
    },
    last_message_time: {
        type: Date
    },
    group: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Conversation', ConversationSchema);