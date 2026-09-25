const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username irakenewe'],
      unique: true,
      trim: true,
      minlength: 3,
    },
    identityNumber: {
      type: String,
      required: [true, 'Indangamuntu irakenewe'],
      unique: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: [true, 'Telefone irakenewe'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Aho utuye birakenewe'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Ijambo ry\'ibanga rirakenewe'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);