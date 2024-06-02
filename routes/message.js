const express = require('express');
const router = express.Router();

const { getMessageById, getMessagesByConversationId, createMessage, updateMessageById } = require('../controllers/message');

router.route('/').post(createMessage);
router.route('/byid/:id').get(getMessageById).patch(updateMessageById);
router.route('/byconvid/:conversation_id').get(getMessagesByConversationId);

module.exports = router;
