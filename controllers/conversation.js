const Conversation = require("../models/Conversation");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const {
  CLOUDINARY_CLOUD_NAME: cloud_name,
  CLOUDINARY_API_KEY: api_key,
  CLOUDINARY_API_SECRET: api_secret
} = process.env;
cloudinary.config({ cloud_name, api_key, api_secret });
const createConversation = async(req, res)=>{ 
    try{
        const send = await Conversation.create(req.body);
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json({msg: err});
    }
}

const uploadpfp = async(req, res)=>{
    const {id} = req.params;
    try{
        
        const file = req.file;
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: file.filename
        }).catch((error)=>{console.log(error)});
        

        const send = await Conversation.findOneAndUpdate({_id: id}, { profile_picture: uploadResult.url }, {new: true, runValidators: true})
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
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
    updateConversationById,
    uploadpfp
};