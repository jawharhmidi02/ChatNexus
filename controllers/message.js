const Message = require("../models/Message");
require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.SECRET_KEY, 'hex');
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const createMessage = async(req, res)=>{
    req.body.content = encrypt(req.body.content);
    try{
        const send = await Message.create(req.body);
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const getMessagesByConversationId = async(req, res)=>{
    const {conversation_id: conversation_id} = req.params;

    try{
        const messages = await Message.find({conversation_id: conversation_id});

        const decryptedMessages = messages.map(message => {
            const decryptedContent = decrypt(message.content);
            return {
                ...message.toObject(), 
                content: decryptedContent
            };
        });

        return res.status(200).json(decryptedMessages);

    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const getMessageById = async(req, res)=>{
    const {id: id} = req.params;

    try{
        const send = await Message.findById(id);
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const getMessageBySender = async(req, res)=>{
    const {sender: sender} = req.params;

    try{
        const send = await Message.find({sender});
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const updateMessageById = async(req, res)=>{
    const {id: id} = req.params;
    if(req.body.content){
        req.body.content = encrypt(req.body.content);
    }
    try{
        const send = await Message.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}


module.exports = {
    getMessageById,
    getMessagesByConversationId,
    getMessageBySender,
    createMessage,
    updateMessageById
};