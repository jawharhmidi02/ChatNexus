const express = require('express');
const router = express.Router();

const { getMessageById, getMessagesByConversationId, getMessageBySender, createMessage, updateMessageById } = require('../controllers/message');

router.route('/').post(createMessage);
router.route('/byid/:id').get(getMessageById).patch(updateMessageById);
router.route('/byconvid/:conversation_id').get(getMessagesByConversationId);
router.route('/bysender/:sender').get(getMessageBySender);
module.exports = router;
