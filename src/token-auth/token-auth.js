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
        var location = this.viewModel.attr('keyLocation');
        return this.viewModel.attr('rememberMe') ? localStorage.getItem(location) : sessionStorage.getItem(location);
      }
    },

    auth: {
      get(lastSetVal, setVal){
        return lastSetVal;
      }
    },

    
    /**
     * This will cause the auth token to be stored in localStorage instead of 
     * sessionStorage (so that it persists between sessions).
     * @type {String}
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

  login(params){
    return $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: this.attr('loginEndpoint'),
      data: JSON.stringify(params)
    });
  }

});

export default Component.extend({
  tag: 'token-auth',
  viewModel: ViewModel,
  template,
  events: {
    init(){
      var token = this.viewModel.attr('token');
      if (token) {
        this.viewModel.login({token:token}).then(function(data){
          console.log(data);
        });
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

