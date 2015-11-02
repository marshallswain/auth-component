import QUnit from 'steal-qunit';
import { ViewModel } from './login-form';

// ViewModel unit tests
QUnit.module('auth-component/login-form');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the login-form component');
});
