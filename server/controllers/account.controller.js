import Account from '../models/account';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all accounts
 * @param req
 * @param res
 * @returns void
 */
export function getAccounts(req, res) {
  Account.find().exec((err, accounts) => {
    if (err) {
      res.status(500).send(err);
    }
    //console.log(accounts);
    res.json({ accounts });
  });
}

/**
 * Save an account
 * @param req
 * @param res
 * @returns void
 */
export function addAccount(req, res) {
  if (!req.body.account.email || !req.body.account.password) {
    res.status(403).end();
  }

  const newAccount = new Account(req.body.account);

  // Let's sanitize inputs
  newAccount.email = sanitizeHtml(newAccount.email);
  newAccount.password = sanitizeHtml(newAccount.password);
  newAccount.cuid = cuid();
  newAccount.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ account: saved });
  });
}

/**
 * Get a single account
 * @param req
 * @param res
 * @returns void
 */
export function getAccount(req, res) {
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ account });
  });
}

/**
 * Delete a account
 * @param req
 * @param res
 * @returns void
 */
export function deleteAccount(req, res) {
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    account.remove(() => {
      res.status(200).end();
    });
  });
}

/**
 * Update a account
 * @param req
 * @param res
 * @returns void
 */
export function updateAccount(req, res) {
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    account.users = req.body.account.users;
    account.password = req.body.account.password;
    account.threads = req.body.account.threads;
    account.save((err, saved) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ account: saved });
    });
  });
}
