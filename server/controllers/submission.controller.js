import request from '../util/request';
import { projectsUrl, submitUrl, listSubmissionsUrl, assignCountUrl } from '../util/udacityHelpers';
import { getAuthToken } from '../util/request';
import sendMail from '../util/mailer';
const async = require("async");
const numCPUs = require('os').cpus().length;
import Account from '../models/account';
import logWriter from '../util/logWriter';


export function getSubmission(req, res) {

  // start timer
  var hrstart = process.hrtime();

  // Get the udacity account token
  Account.findOne({ cuid: req.params.cuid }).exec((err, account) => {
    if (err || account == null) {
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
        //log start
        var hrend = process.hrtime(hrstart);
        logWriter('getSubmission: ',response,hrend);
        //log end
        res.status(200).json({
          success: true,
          submission: response.error || response.FetchError || response.name == 'FetchError'
                        ? [] : response.map(v => {
                          v.cuid = account.cuid;
                          return v;
                        })
        });
      });
    });
  });
}