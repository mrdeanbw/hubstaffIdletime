import Assigner from '../models/assigner';
import request from '../util/request';
import { projectsUrl, submitUrl, listSubmissionsUrl, assignCountUrl } from '../util/udacityHelpers';
import { getAuthToken } from '../util/request';
import {sendMail} from '../util/mailer';
const async = require("async");
const numCPUs = require('os').cpus().length;
import Account from '../models/account';


export function getProjects(req, res) {
  // Get the udacity account token
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
          console.log("cuid :"+req.params.cuid);
    if (err) {
      res.status(500).send(err);
    }

    var credentials = {
      email: account.email,
      password: account.password
    }
    getAuthToken(credentials).then(token => {
      //console.log(token);
      request(projectsUrl, {'Authorization' : token}).then(response => {
        // TODO: handle multiple accounts, currently return projects of first account only.
        console.log('Projects');
        console.log(response);
        response.forEach((project) => project.cuid = account.cuid );
        res.status(200).json({
          success: true,
          projects: response
        });
      });
    });
  });
}

export function postProjects(req, res) {
  // TODO: check to see if we have an projects.
  // Get the udacity account token
  Account.findOne({ cuid: req.body.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    var credentials = {
      email: account.email,
      password: account.password
    }
    getAuthToken(credentials).then(token => {
      //console.log(req.body);
      let processes = [];

      // Fork workers.
      // TODO: hardcoded number of threads for now, need to be set by admin per account.
      for (let i = 0; i < account.threads; i++) {
        processes.push(function(callback){
          request(submitUrl, {'Authorization' : token}, 'post' , {projects: req.body.projects}).then(response => {
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
          if (value.error || value.FetchError || value.name == 'FetchError') {
            error = value.error || value.FetchError;
          }
          else {
            value.cuid = account.cuid;
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
    });
  });
}

export function getPositions(req, res) {
  // Get the udacity account token
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    var credentials = {
      email: account.email,
      password: account.password
    }
    getAuthToken(credentials).then(token => {
      console.log(token);
      request(submitUrl + "/" + req.params.submissionId + "/waits.json", {'Authorization' : token}).then(response => {
        console.log('Positions');
        console.log(response);
        response.forEach(project => project.cuid = account.cuid );
        res.status(200).json({
          success: true,
          submissionId: req.params.submissionId,
          positions: response
        });
      });
    });
  });
}

export function getSubmission(req, res) {
  // Get the udacity account token
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    var credentials = {
      email: account.email,
      password: account.password
    }
    getAuthToken(credentials).then(token => {
      console.log(token);
      request(listSubmissionsUrl, {'Authorization' : token}).then(response => {
        // TODO: handle multiple accounts, currently return projects of first account only.
        console.log("Submissions");
        console.log(response);
        res.status(200).json({
          success: true,
          submission: response.error || response.FetchError || response.name == 'FetchError'
                        ? [] : response.map(v => v.cuid = account.cuid )
        });
      });
    });
  });
}

export function cancel(req, res) {
  // Get the udacity account token
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    var credentials = {
      email: account.email,
      password: account.password
    }
    getAuthToken(credentials).then(token => {
      console.log('Cancelling project...');
      request(submitUrl + "/" + req.params.submissionId + ".json", {'Authorization' : token}, 'delete').then(response => {
        //console.log(response);
        res.status(200).json({
          success: true,
        });
      });
    });
  });
}

export function notify(req, res) {
  Account.findOne({ cuid: req.params.cuid }).populate('users').exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    account.users.forEach(user => {
      // Email the user
      // req.user
      // req.params.projectId
      let mailOptions = {
        to: user.email,
        cc:'adipster.script@gmail.com',
        subject: 'Project Assigned: ' + req.params.projectId, // Subject line
        text: 'Dear ' + user.name + ', \n Project with id ' + req.params.projectId + ' has been assigned to you!', // plain text body
      };
      sendMail(mailOptions, (error, info) => {
          res.status(200).json({
            success: error ? false : true,
          });
      });
    });
  });
}

export function refresh(req, res) {
  // Get the udacity account token
 Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

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
    });
  });
}

export function getAssignCount(req, res) {
  // Get the udacity account token
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err) {
      res.status(500).send(err);
    }

    var credentials = {
      email: account.email,
      password: account.password
    }
    getAuthToken(credentials).then(token => {
      //console.log(token);
      console.log("Assign count----");
      request(assignCountUrl, {'Authorization' : token}).then(response => {
        // TODO: handle multiple accounts, currently return projects of first account only.
        console.log(response);
        res.status(200).json({
          success: true,
          assignCount: response.assigned_count || 0
        });
      });
    });
  });
}