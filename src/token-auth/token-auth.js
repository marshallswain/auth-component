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

  login(username, password){
    var self = this, params = {};
    params[this.attr('usernameField')] = username;
    params[this.attr('passwordField')] = password;
    this.sendLogin(params).then(function(response){
      // Check for responseTokenPath and responseDataPath.
      // console.log('login response: ', response);
      self.attr('auth', response);
    });
  },

  tokenLogin(params){
    var self = this;
    this.sendLogin(params).then(function(response){
      // Check for responseTokenPath and responseDataPath.
      // console.log('tokenLogin response: ', response);
      self.attr('auth', response);
    });
  },

  usernameField: 'username',
  passwordField: 'password',

  sendLogin(params){
    var self = this;
    return $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: self.attr('loginEndpoint'),
      data: JSON.stringify(params)
    });
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

