import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
import cuid from 'cuid';

const userSchema = new Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  name: String,
  roles: [{ type: Schema.Types.ObjectId, ref: 'role' }],
  cuid: { type: 'String', required: true },
  accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
});

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
userSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};


/**
 * The pre-save hook method.
 */
userSchema.pre('save', function saveHook(next) {
  const user = this;

  user.accounts.forEach(function (account) {
    if (typeof account.users !== 'undefined') {
      account.users.push(user._id);
      account.save();
    }
  }, this);

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  user.cuid = cuid();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

export default mongoose.model('User', userSchema);
