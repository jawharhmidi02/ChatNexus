const Account = require("../models/Account");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const createAccount = async(req,res)=>{
    req.body.password = await bcrypt.hash(req.body.password, 10);
    try{
        const send = await Account.create(req.body);
        await User.create(req.body);
        res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const getAccountByUsername = async(req, res)=>{
    const {username: username, password: password} = req.params;

    try{
        const send = await Account.findOne({username : username})
        if(send){
            
            const isMatch = await bcrypt.compare(password, send.password);
            if(!isMatch){
                return res.status(200).json(null);
            }
        }
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const getAccountByEmail = async(req, res)=>{
    const {email: email, password: password} = req.params;
    try{
        const send = await Account.findOne({email : email})

        if(send){
            
            const isMatch = await bcrypt.compare(password, send.password);
            if(!isMatch){
                return res.status(200).json(null);
            }
        }
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const getAccountByPhoneNumber = async(req, res)=>{
    const {phonenumber: phonenumber, password: password} = req.params;
    try{
        const send = await Account.findOne({phonenumber : phonenumber})
        
        if(send){
            
            const isMatch = await bcrypt.compare(password, send.password);
            if(!isMatch){
                return res.status(200).json(null);
            }
        }
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const updateAccountByUsername = async(req, res)=>{
    const {username: username, password: password} = req.params;
    console.log(req.body);
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try{

        const check = await Account.findOne({username : username})

        if(!check){
            return res.status(404).json({msg : `No Account found with Username : ${username}`});
        }

        if(check){
            
            const isMatch = await bcrypt.compare(password, check.password);
            if(!isMatch){
                return res.status(404).json({msg: `No Account found with username: ${username} and password: ${password}`});
            }

        }
        
        await User.findOneAndUpdate({ username: username }, req.body, {new: true, runValidators: true});
        const send = await Account.findOneAndUpdate({username: username}, req.body, {new: true, runValidators: true})
        res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const updateAccountByEmail = async(req, res)=>{
    const {email: email, password: password} = req.params;
    try{
        const check = await Account.findOne({email : email})

        if(!check){
            return res.status(404).json({msg : `No Account found with email : ${email}`});
        }

        if(check){
            
            const isMatch = await bcrypt.compare(password, check.password);
            if(!isMatch){
                return res.status(404).json({msg: `No Account found with email: ${email} and password: ${password}`});
            }

            const send = await Account.findOneAndUpdate({email: email}, req.body, {new: true, runValidators: true})
        }

        await User.findOneAndUpdate({ email: email }, req.body, {new: true, runValidators: true});
        res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const updateAccountByPhoneNumber = async(req, res)=>{
    const {phonenumber: phonenumber, password: password} = req.params;
    try{
        const check = await Account.findOne({phonenumber : phonenumber})

        if(!check){
            return res.status(404).json({msg : `No Account found with phonenumber : ${phonenumber}`});
        }

        if(check){
            
            const isMatch = await bcrypt.compare(password, check.password);
            if(!isMatch){
                return res.status(404).json({msg: `No Account found with phonenumber: ${phonenumber} and password: ${password}`});
            }

            const send = await Account.findOneAndUpdate({phonenumber: phonenumber}, req.body, {new: true, runValidators: true})
        }
        await User.findOneAndUpdate({ phonenumber: phonenumber }, req.body, {new: true, runValidators: true});
        res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const deleteAccountByUsername = async(req, res)=>{
    const {username: username, password: password} = req.params;
    try{
        const check = await Account.findOne({username : username})

        if(!check){
            return res.status(404).json({msg : `No Account found with Username : ${username}`});
        }

        if(check){
            
            const isMatch = await bcrypt.compare(password, check.password);
            if(!isMatch){
                return res.status(404).json({msg: `No Account found with username: ${username} and password: ${password}`});
            }

            const send = await Account.findOneAndDelete({username: username, password: password})
        }
        await User.findOneAndDelete({ username: username }, req.body, {new: true, runValidators: true});
        res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}


const deleteAccountByEmail = async(req, res)=>{
    const {email: email, password: password} = req.params;
    console.log(email);
    try{
        const check = await Account.findOne({email : email})

        if(!check){
            return res.status(404).json({msg : `No Account found with email : ${email}`});
        }

        if(check){
            
            const isMatch = await bcrypt.compare(password, check.password);
            if(!isMatch){
                return res.status(404).json({msg: `No Account found with email: ${email} and password: ${password}`});
            }
            
            const send = await Account.findOneAndDelete({email: email, password: password})
        }
        await User.findOneAndDelete({ email: email }, req.body, {new: true, runValidators: true});
        res.status(200).json({status:'Done'});
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const deleteAccountByPhoneNumber = async(req, res)=>{
    const {phonenumber: phonenumber, password: password} = req.params;
    try{
        const check = await Account.findOne({phonenumber : phonenumber})

        if(!check){
            return res.status(404).json({msg : `No Account found with Phonenumber : ${phonenumber}`});
        }

        if(check){
            
            const isMatch = await bcrypt.compare(password, check.password);
            if(!isMatch){
                return res.status(404).json({msg: `No Account found with phonenumber: ${phonenumber} and password: ${password}`});
            }
            
            const send = await Account.findOneAndDelete({phonenumber: phonenumber, password: password})
        }
        await User.findOneAndDelete({ phonenumber: phonenumber }, req.body, {new: true, runValidators: true});
        res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const {
  CLOUDINARY_CLOUD_NAME: cloud_name,
  CLOUDINARY_API_KEY: api_key,
  CLOUDINARY_API_SECRET: api_secret
} = process.env;
cloudinary.config({ cloud_name, api_key, api_secret });

const uploadProfilePictureByUsername = async(req, res)=>{
    const {username: username, password: password} = req.params;
    try{
        const check = await Account.findOne({username : username})

        if(!check){
            return res.status(404).json({msg : `No Account found with Username : ${username}`});
        }

        const isMatch = await bcrypt.compare(password, check.password);
        if(!isMatch){
            return res.status(404).json({msg: `No Account found with username: ${username} and password: ${password}`});
        }
        console.log("e1",cloud_name, api_key, api_secret);

        const file = req.file;
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: file.filename
        }).catch((error)=>{console.log(error)});
        

        const send = await Account.findOneAndUpdate({username: username}, { profile_picture: uploadResult.url }, {new: true, runValidators: true})
        
        await User.findOneAndUpdate({ username: username }, { profile_picture: uploadResult.url }, {new: true, runValidators: true});
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

module.exports = {
    createAccount,
    getAccountByUsername,
    updateAccountByUsername,
    deleteAccountByUsername,
    getAccountByEmail,
    updateAccountByEmail,
    deleteAccountByEmail,
    getAccountByPhoneNumber,
    updateAccountByPhoneNumber,
    deleteAccountByPhoneNumber,
    uploadProfilePictureByUsername
};