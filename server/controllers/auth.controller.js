const express = require('express');
const passport = require('passport');
import validateLoginForm from '../shared/validation';
import logWriter from '../util/logWriter';

export function login(req, res, next) {
  // start timer
  var hrstart = process.hrtime();

  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {

        //log start
        var hrend = process.hrtime(hrstart);
        logWriter('Logon denied: Incorrect Credentials',{},hrend);
        //log end 

        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    //log start
        var hrend = process.hrtime(hrstart);
        logWriter('Logon accepted: You have successfully logged in!',{},hrend);
        //log end


    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
}