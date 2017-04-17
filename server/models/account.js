import mongoose from 'mongoose';
import cuid from 'cuid';
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  threads: {type: Number},  
  cuid: { type: 'String', required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

/**
 * The pre-save hook method.
 */
accountSchema.pre('save', function saveHook(next) {
  const account = this;

  account.cuid = cuid();
  account.users.forEach(function (user) {
    if (typeof user.accounts !== 'undefined') {
      user.accounts.push(account._id);
      user.save();
    }
  }, this);

  return next();
});

export default mongoose.model('Account', accountSchema);
