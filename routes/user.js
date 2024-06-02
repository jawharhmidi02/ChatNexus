const express = require('express');
const router = express.Router();

const { getAllUsers, getUserByUsername, getUserByEmail, getUserByPhoneNumber } = require('../controllers/user');

router.route('/:search').get(getAllUsers);
router.route('/byusername/:username').get(getUserByUsername);
router.route('/byemail/:email').get(getUserByEmail);
router.route('/byphonenumber/:phonenumber').get(getUserByPhoneNumber);

module.exports = router;
