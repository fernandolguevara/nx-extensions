import { Component, Element, h } from '@stencil/core';

import state, { ModeType } from '../../store';

@Component({
  tag: 'site-container',
})
export class App {
  @Element() el: HTMLElement;

  render() {
    return (
      <site-root
        class={state.pageTheme == ModeType.Dark ? 'mode-dark' : 'mode-light'}
      >
        <div class="flex flex-col h-screen bg-background-secondary">
          <site-navigation></site-navigation>

          <div class="content flex-grow">
            <div class="bg-background-secondary">
              <div class="container mx-auto px-8">
                <site-routes />
              </div>
            </div>
          </div>

          <site-footer />
        </div>
      </site-root>
    );
  }
}
