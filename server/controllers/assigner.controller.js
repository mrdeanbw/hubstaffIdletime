import Assigner from '../models/assigner';
import request from '../util/request';
import { projectsUrl, submitUrl, listSubmissionsUrl } from '../util/udacityHelpers';
import { getAuthToken } from '../util/request';

export function getProjects(req, res) {
  // Get the udacity account token
  req.user.populate('accounts', (err, user) => {
    user.accounts.forEach(function(account) {
      //console.log(account);
      var credentials = {
        email: account.email,
        password: account.password
      }
      getAuthToken(credentials).then(token => {
        console.log(token);
        request(projectsUrl, {'Authorization' : token}).then(response => {
          // TODO: handle multiple accounts, currently return projects of first account only.
          //console.log(response);
          res.status(200).json({
            success: true,
            projects: response
          });
        });
      })
    }, this);
  })
  
}

export function postProjects(req, res) {
  // TODO: check to see if we have an projects.
  // Get the udacity account token
  req.user.populate('accounts', (err, user) => {
    user.accounts.forEach(function(account) {
      console.log(account);
      var credentials = {
        email: account.email,
        password: account.password
      }
      getAuthToken(credentials).then(token => {
        console.log(req.body);
        request(submitUrl, {'Authorization' : token}, 'post' , {projects: req.body}).then(response => {
          request(submitUrl + "/" + response.id + "/waits.json", {'Authorization' : token}).then(responsePositions => {
            console.log(responsePositions);
            res.status(200).json({
              success: true,
              submission: response,
              positions: responsePositions
            });
          });
        });
      })
    }, this);
  })
  
}

export function getPositions(req, res) {
  // Get the udacity account token
  req.user.populate('accounts', (err, user) => {
    user.accounts.forEach(function(account) {
      //console.log(account);
      var credentials = {
        email: account.email,
        password: account.password
      }
      getAuthToken(credentials).then(token => {
        console.log(req.params.submissionId);
        request(submitUrl + "/" + req.params.submissionId + "/waits.json", {'Authorization' : token}).then(response => {
          console.log(response);
          res.status(200).json({
            success: true,
            positions: response
          });
        });
      })
    }, this);
  })
  
}

export function getSubmission(req, res) {
  // Get the udacity account token
  req.user.populate('accounts', (err, user) => {
    user.accounts.forEach(function(account) {
      //console.log(account);
      var credentials = {
        email: account.email,
        password: account.password
      }
      getAuthToken(credentials).then(token => {
        //console.log(token);
        request(listSubmissionsUrl, {'Authorization' : token}).then(response => {
          // TODO: handle multiple accounts, currently return projects of first account only.
          //console.log(response);
          res.status(200).json({
            success: true,
            submission: response[0]
          });
        });
      })
    }, this);
  })
  
}