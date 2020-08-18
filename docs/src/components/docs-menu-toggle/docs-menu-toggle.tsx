import { Component, h, Host } from '@stencil/core';

import state from '../../store';
import Router from '../../router';

@Component({
  tag: 'docs-menu-toggle'
})
export class DocsMenuToggle {

  handleButtonClick() {
    state.menuShown = !state.menuShown;
  }

  render() {
    const path = '/docs';
    if (
      Router.activePath === path ||
      Router.activePath + Router.url.hash === path
    ) {
      return (
        <Host>
          <div class="block md:hidden">
            <a onClick={() => this.handleButtonClick()}
               class="relative z-50 block px-3 h-32 bg-blue-900 text-white text-center tracking-widest uppercase text-xs font-bold pt-8 pb-6 flex flex-col items-center justify-between hover:bg-gray-900">
              <span>menu</span>
              <div class="flex items-end justify-center">
                <span class="block h-5 w-1 bg-yellow-600"></span>
                <span class="block h-8 w-1 bg-yellow-600 mx-1"></span>
                <span class="block h-5 w-1 bg-yellow-600"></span>
              </div>
            </a>
          </div>
        </Host>
      );
    }
  }
}
