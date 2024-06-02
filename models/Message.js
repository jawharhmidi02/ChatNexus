const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    conversation_id: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    content: { 
        type: String, 
        required: true 
    },
    reacts: {
        type: Array,
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    edited: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Message', MessageSchema);