const Conversation = require("../models/Conversation");

const createConversation = async(req, res)=>{
    try{
        const send = await Conversation.create(req.body);
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const getConversationById = async(req, res)=>{
    const {id: id} = req.params;

    try{
        const send = await Conversation.findById(id);
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const updateConversationById = async(req, res)=>{
    const {id: id} = req.params;
    try{
        const send = await Conversation.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}


module.exports = {
    getConversationById,
    createConversation,
    updateConversationById
};