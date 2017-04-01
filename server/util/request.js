import fetch from 'isomorphic-fetch';
import { baseUrl, loginUrl } from './udacityHelpers';

export const API_URL = baseUrl;

var CommonHeaders = { 'content-type': 'application/json' };

export default function callApi(endpoint, extraHeaders, method = 'get', body) {
  Object.keys(extraHeaders).forEach(function(key) {
    CommonHeaders[key] = extraHeaders[key];
  }, this);
  //console.log(CommonHeaders);
  return fetch(`${API_URL}/${endpoint}`, {
    headers: CommonHeaders,
    method,
    body: JSON.stringify(body),
  })
  .then(response => {
    try{
      return response.json().then(json => ({ json, response }));
    }
    catch(err) {
      return Promise.reject(err);
    }
  })
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  })
  .then(
    response => response,
    error => error
  );
}

export function getAuthToken(body) {
  
  // Headers
  //'Origin: https://auth.udacity.com'
  //'Accept-Encoding: gzip, deflate, br'
  //'Accept-Language: en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,fr;q=0.2'
  //'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  //'Content-Type: application/json'
  //'Accept: application/json'
  //'Referer: https://auth.udacity.com/sign-in?next=https%3A%2F%2Fclassroom.udacity.com%2Fauthenticated'
  //'Connection: keep-alive'
  //console.log(loginUrl);
  return fetch(loginUrl, {
    headers: {
      'Origin': 'https://auth.udacity.com',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,fr;q=0.2',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://auth.udacity.com/sign-in?next=https%3A%2F%2Fclassroom.udacity.com%2Fauthenticated',
      'Connection': 'keep-alive',
    },
    method: 'post',
    body: JSON.stringify(body),
  })
  .then(response => {
    //console.log(response);
    return response.json().then(json => ({ json, response }));
  })
  .then(({ json, response }) => {
    //console.log(json);
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  })
  .then(
    response => response.jwt,
    error => error
  );
}
