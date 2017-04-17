const User = require('mongoose').model('User');
const config = require('../config');


/**
 *  The Authorization Checker middleware function.
 */
const HasRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).end();
    }

    // Check user roles
    return req.user.populate('roles', (err, user) => {
     if (!user.roles.map(value => { return value.name }).includes(role)) {
         return res.status(401).end();
       }
        return next();
    });
  };
}

export var HasAdminRole = () => { return HasRole('Admin');}