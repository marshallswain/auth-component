import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './auth-spinner.less!';
import template from './auth-spinner.stache!';

export const ViewModel = Map.extend({
  type: 'bar'
});

export default Component.extend({
  tag: 'auth-spinner',
  viewModel: ViewModel,
  template
});