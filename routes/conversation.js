const express = require('express');
const router = express.Router();

const { getConversationById, createConversation, updateConversationById } = require('../controllers/conversation');

router.route('/').post(createConversation);
router.route('/byid/:id').get(getConversationById).patch(updateConversationById);

module.exports = router;
