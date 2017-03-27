import Assigner from '../models/assigner';
import request from '../util/request';
import { projectsUrl, submitUrl, listSubmissionsUrl } from '../util/udacityHelpers';
import { getAuthToken } from '../util/request';
import {sendMail} from '../util/mailer';
const async = require("async");
const numCPUs = require('os').cpus().length;

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
        //console.log(token);
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
        //console.log(req.body);
        let processes = [];

        // Fork workers.
        // TODO: hardcoded number of threads for now, need to be set by admin per account.
        for (let i = 0; i < 13; i++) {
          processes.push(function(callback){
            request(submitUrl, {'Authorization' : token}, 'post' , {projects: req.body}).then(response => {
              //console.log(response);
              if (response.error) {
                // TODO: ignore for now, need to find a way on how to OR errors
                //callback(response.error, null)
              }
              callback(null, response);
            });
          });
        }

        async.parallel(processes, function(err, results){
          // All tasks are done now
          console.log(results);
          let error = null;
          let returnResults = [];
          results.map(value => {
            if (value.error) {
              error = value.error;
            }
            else {
              returnResults.push(value);
            }
          });
          let hasError = returnResults.length == 0;
          res.status(200).json({
            success: hasError ? false : true,
            submission: returnResults,
            message: hasError ? error : ""
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
        //console.log(token);
        request(submitUrl + "/" + req.params.submissionId + "/waits.json", {'Authorization' : token}).then(response => {
          console.log('Positions');
          console.log(response);
          res.status(200).json({
            success: true,
            submissionId: req.params.submissionId,
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
          console.log("Submissions");
          console.log(response);
          res.status(200).json({
            success: true,
            submission: response || []
          });
        });
      })
    }, this);
  })
  
}

export function cancel(req, res) {
  // Get the udacity account token
  req.user.populate('accounts', (err, user) => {
    user.accounts.forEach(function(account) {
      //console.log(account);
      var credentials = {
        email: account.email,
        password: account.password
      }
      getAuthToken(credentials).then(token => {
        console.log('Cancelling project...');
        request(submitUrl + "/" + req.params.submissionId + ".json", {'Authorization' : token}, 'delete').then(response => {
          console.log(response);
          res.status(200).json({
            success: true,
          });
        });
      })
    }, this);
  })
  
}

export function notify(req, res) {
  // Email the user
  // req.user
  // req.params.projectId
  let mailOptions = {
    to: req.user.email,
    subject: 'Project Assigned: ' + req.params.projectId, // Subject line
    text: 'Dear ' + req.user.name + ', \n Project with id ' + req.params.projectId + ' has been assigned to you!', // plain text body
  };
  sendMail(mailOptions, (error, info) => {
      res.status(200).json({
        success: error ? false : true,
      });
  });
  
}

export function refresh(req, res) {
  // Get the udacity account token
  req.user.populate('accounts', (err, user) => {
    user.accounts.forEach(function(account) {
      //console.log(account);
      var credentials = {
        email: account.email,
        password: account.password
      }
      getAuthToken(credentials).then(token => {
        console.log('Refreshing project...');
        request(submitUrl + "/" + req.params.submissionId + "/refresh.json", {'Authorization' : token}, 'put').then(response => {
          console.log(response);
          res.status(200).json({
            success: response.error ? false : true,
            submission: response.error ? {} : response,
            message: response.error || ""
          });
        });
      })
    }, this);
  })
  
}