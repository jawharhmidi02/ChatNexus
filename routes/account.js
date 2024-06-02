const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { getAllAccounts, createAccount, getAccountByUsername, updateAccountByUsername, deleteAccountByUsername, getAccountByEmail, updateAccountByEmail, deleteAccountByEmail, getAccountByPhoneNumber, updateAccountByPhoneNumber, deleteAccountByPhoneNumber, uploadProfilePictureByUsername } = require('../controllers/account');

router.route('/').post(createAccount);
router.route('/byusername/:username&:password').get(getAccountByUsername).patch(updateAccountByUsername).delete(deleteAccountByUsername);
router.route('/byemail/:email&:password').get(getAccountByEmail).patch(updateAccountByEmail).delete(deleteAccountByEmail);
router.route('/byphonenumber/:phonenumber&:password').get(getAccountByPhoneNumber).patch(updateAccountByPhoneNumber).delete(deleteAccountByPhoneNumber);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/photos');
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename.replace(/\\/g, '/'));
    }
});

const upload = multer({ storage: storage });

router.route('/uploadprofilepicture/:username&:password').post(upload.single('profilePicture'), uploadProfilePictureByUsername);

module.exports = router;
