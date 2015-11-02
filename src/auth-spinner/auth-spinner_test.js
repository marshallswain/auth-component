import QUnit from 'steal-qunit';
import { ViewModel } from './auth-spinner';

// ViewModel unit tests
QUnit.module('auth-component/auth-spinner');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the auth-spinner component');
});
