import { Component, h, Prop } from '@stencil/core';
import state from '../../store';

@Component({
  tag: 'nxext-logo'
})
export class NxextLogo {

  @Prop() borderless: boolean = false;

  lightText = <span><span class="text-yellow-600">Nx</span><span class="text-blue-900">ext</span></span>;
  darkText = <span><span class="text-yellow-600">Nx</span><span class="text-blue-900">ext</span></span>;

  render() {
    if(state.pageTheme === 'mode-dark') {
      if(this.borderless) {
        return this.lightText;
      } else {
        return (
          <div class="inline-block bg-transparent font-mono py-1 px-2 border border-blue-900 rounded-full">
            {this.lightText}
          </div>
        );
      }
    } else {
      if(this.borderless) {
        return this.lightText;
      } else {
        return (
          <div class="inline-block bg-transparent font-mono py-1 px-2 border border-blue-900 rounded-full">
            {this.lightText}
          </div>
        );
      }
    }
  }
}
