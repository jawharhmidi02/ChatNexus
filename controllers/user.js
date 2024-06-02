const User = require("../models/user");

const getAllUsers = async (req, res) => {
    const { search } = req.params;

    try {
        const regex = new RegExp(search, 'i');
        const users = await User.find({
            $or: [
                { first_name: { $regex: regex } },
                { last_name: { $regex: regex } }
            ]
        });

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

const getUserByUsername = async(req, res)=>{
    const {username: username} = req.params;

    try{
        const send = await User.findOne({username : username})
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const getUserByEmail = async(req, res)=>{
    const {email: email} = req.params;
    try{
        const send = await User.findOne({email : email})
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}

const getUserByPhoneNumber = async(req, res)=>{
    const {phonenumber: phonenumber} = req.params;
    try{
        const send = await User.findOne({phonenumber : phonenumber})
        
        return res.status(200).json(send);
    }
    catch(err){
        return res.status(500).json(err);
    }
}


module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserByEmail,
    getUserByPhoneNumber
};