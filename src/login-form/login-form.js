import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './login-form.less!';
import template from './login-form.stache!';

export const ViewModel = Map.extend({
  define: {
  }
});

export default Component.extend({
  tag: 'login-form',
  viewModel: ViewModel,
  template
});