const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const JWT_SECRET  = process.env.JWT_SECRET || 'orion_secret_change_me';
const JWT_EXPIRES = '30d';

function makeToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, profile } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email déjà utilisé.' });

    const user  = await User.create({ name, email, password, profile });
    const token = makeToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const token = makeToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', require('../middlewares/auth.middleware'), async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({ user });
  } catch (err) { next(err); }
});

module.exports = router;
