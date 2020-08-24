import { Component, h, Host } from '@stencil/core';

import state from '../../store';
import Router from '../../router';

@Component({
  tag: 'docs-menu-toggle',
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
          <button
            onClick={() => this.handleButtonClick()}
            class="inline-flex items-center justify-center p-2 rounded-md hover:bg-background-secondary focus:outline-none focus:bg-background-secondary transition duration-150 ease-in-out"
            aria-label="Main menu"
            aria-expanded="false"
          >
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <svg
              class="hidden h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Host>
      );
    }
  }
}
