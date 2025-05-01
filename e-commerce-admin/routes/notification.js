const express = require('express');
const router = express.Router();
const admin = require('../firebase');

// POST /send-notification
router.post('/send-notification', async (req, res) => {
  const { deviceToken, title, body } = req.body;

  if (!deviceToken || !title || !body) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const message = {
    notification: {
      title,
      body,
    },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
