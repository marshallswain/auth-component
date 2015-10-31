import QUnit from 'steal-qunit';
import { ViewModel } from './token-auth';

// ViewModel unit tests
QUnit.module('auth-component/token-auth');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the token-auth component');
});
