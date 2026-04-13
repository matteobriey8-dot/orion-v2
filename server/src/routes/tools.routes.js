const router = require('express').Router();
const auth   = require('../middlewares/auth.middleware');

// Placeholder — les routes outils seront ajoutées partie par partie
router.get('/', auth, (_, res) => {
  res.json({ tools: 72, status: 'ready' });
});

module.exports = router;
