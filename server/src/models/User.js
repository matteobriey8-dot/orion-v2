const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  profile:  { type: String, enum: ['student', 'freelance', 'lifestyle'], default: 'lifestyle' },
  lifeScore: { type: Number, default: 0 },
  settings: {
    theme:         { type: String, default: 'dark' },
    notifications: { type: Boolean, default: true },
    language:      { type: String, default: 'fr' },
  },
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode de comparaison
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Ne jamais renvoyer le mot de passe
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
