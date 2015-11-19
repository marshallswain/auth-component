import $ from 'jquery';
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './token-auth.less!';
import template from './token-auth.stache!';

export const ViewModel = Map.extend({
  define: {

    token: {
      get(){
        var token, location = this.attr('keyLocation');
        if (this.attr('rememberMe') && window.localStorage) {
          token = window.localStorage.getItem(location);
        } else if(window.sessionStorage) {
          token = window.sessionStorage.getItem(location);  
        }
        return token;
      },

      /**
       * Writes the token to either sessionStorage or localStorage depending on 
       * if rememberMe is enabled.
       * @param {token} the token passed from the auth attr.
       */
      set(val){
        var location = this.attr('keyLocation');
        if (this.attr('rememberMe') && window.localStorage) {
          window.localStorage.setItem(location, val);
        } else if(window.sessionStorage) {
          window.sessionStorage.setItem(location, val);  
        }
        return val;
      }
    },

    /**
     * auth will either be an object containing `token` and `data` attributes, or it will be `false`.
     * @type {Object or Boolean}
     */
    auth: {
      set(val){
        if (val.token) {
          this.attr('token', val.token);
        }
        return val.data;
      }
    },

    /**
     * When enabled, rememberMe will store the auth token in localStorage instead of 
     * sessionStorage (so that it persists between sessions).
     * @type {Boolean}
     */
    rememberMe: {
      set(val){
        return val !== undefined;
      }
    },

    usernameType: {
      get(){
        var type;
        switch(this.attr('usernameField')){
          case 'email':
            type = 'email';
            break;
          case 'phone':
            type = 'phone';
            break;
          default:
            type = 'username';
            break;
        }
        return type;
      }
    }

  },

  /**
   * The default loginEndpoint points to /login on the same server as the 
   * current app.  You can overwrite this using the login-endpoint HTML attribute.
   * @type {String}
   */
  loginEndpoint: '/login',

  /**
   * keyLocation is the location in either sessionStorage or localStorage to where
   * the  auth token will be stored.  This must be provided.
   * @type {String}
   */
  keyLocation: null,

  responseTokenPath: 'token',
  responseDataPath: 'data',

  login(username, password, ev){
    var self = this;

    if (ev) {
      ev.preventDefault();
    }

    this.attr('loggingIn', true);
    this.attr('loginError', false);

    var params = {};
    params[this.attr('usernameField')] = username;
    params[this.attr('passwordField')] = password;

    self.sendLogin(params).then(function(response){
      self.attr('loggingIn', false);
      // Check for responseTokenPath and responseDataPath.
      self.attr('auth', response);

    // Couldn't login with username / password.
    }, function(error){
      self.attr('loggingIn', false);

      var response = error.responseJSON;
      if (response) {
        switch(response.code){
          case 401:
            var message = response.message || self.attr('loginErrorMessage');
            setTimeout(function(){
              self.attr('loginError', message);
            }, 10);
            break;
        }
      }
    });
  },

  tokenLogin(params){
    var self = this;
    this.sendLogin(params).then(function(response){
      // TODO: Check for responseTokenPath and responseDataPath.
      self.attr('auth', response);

    // Couldn't login with broken or expired token. Discard the token.
    }, function(){
      self.attr('loading', false);
      self.removeStoredToken(self.attr('rememberMe'), self.attr('keyLocation'));
    });
  },

  loggingIn: false,

  usernameField: 'username',
  passwordField: 'password',

  loginErrorMessage: 'Invalid Login',
  loginErrorClass: 'shake',

  sendLogin(params){
    var self = this;
    // Login Admin by email (POST http://api.mma.dev:8080/login)
    return $.ajax({
      url: self.attr('loginEndpoint'),
      method: 'POST',
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json'   
      },
      contentType: 'application/json',
      data: JSON.stringify(params)
    });
  },

  /**
   * Removes the auth token from either sessionStorage or localStorage.
   * @param  {Bookean} rememberMe If true, the token is in localStorage, 
   *                              otherwise, it's in sessionStorage
   * @param  {String} location   The key name of the location in storage.
   */
  removeStoredToken(rememberMe, location){
    if (rememberMe) {
      window.localStorage.removeItem(location);
    } else if(window.sessionStorage) {
      window.sessionStorage.removeItem(location);  
    }
  },

  /**
   * Toggles a loading indicator until it's decided if the login form should show or not.
   * @type {Boolean}
   */
  loading: true

});

export default Component.extend({
  tag: 'token-auth',
  viewModel: ViewModel,
  template,
  events: {
    /**
     * On init, check for a token.  If one exists, try to login, otherwise,
     * show the login form to the user.
     */
    init(){
      // Try to login with token.
      var token = this.viewModel.attr('token');
      if (token) {
        this.viewModel.tokenLogin({token: token});
      } else if (window.localStorage) {
        this.viewModel.attr('loading', false);
      }
    }
  }
});

// 1. Is there a remember-me token 
//   yes -> logged in. implicit
//   no -> show login form.

// 2. POST un:pw to /login
//   yes -> logged in. explicit
//   no -> show the user the problem.

// forgot password.
// User management like change password, etc.

