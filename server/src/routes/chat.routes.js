const router  = require('express').Router();
const auth    = require('../middlewares/auth.middleware');
const gemini  = require('../services/gemini.service');

// POST /api/chat  — conversation complète
router.post('/', auth, async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages requis.' });
    }
    const reply = await gemini.chat(messages);
    res.json({ reply });
  } catch (err) { next(err); }
});

// POST /api/chat/tool  — appel ponctuel pour un outil
router.post('/tool', auth, async (req, res, next) => {
  try {
    const { prompt, tool } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt requis.' });
    const prefix = tool ? `[Outil: ${tool}]\n` : '';
    const reply  = await gemini.generate(`${prefix}${prompt}`);
    res.json({ reply });
  } catch (err) { next(err); }
});

module.exports = router;
