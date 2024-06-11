const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename.replace(/\\/g, '/'));
    }
});
const upload = multer({ storage: storage });

const { getConversationById, createConversation, updateConversationById, uploadpfp } = require('../controllers/conversation');

router.route('/').post(createConversation);
router.route('/uploadpfp/:id').post(upload.single('profilePicture'), uploadpfp);
router.route('/byid/:id').get(getConversationById).patch(updateConversationById);

module.exports = router;
