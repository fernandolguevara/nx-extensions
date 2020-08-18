import { Component, Element, h } from '@stencil/core';

import state from '../../store';

@Component({
  tag: 'site-container',
  styleUrl: 'site-container.scss'
})
export class App {
  @Element() el: HTMLElement;

  render() {
    return (
      <site-root class={`${state.pageTheme}`}>
        <div class="bg-gray-100 flex flex-col h-screen">
          <site-navigation></site-navigation>

          <site-mobile-bottom-navigation />

          <site-routes/>

          <site-footer/>
        </div>
      </site-root>
    );
  }
}
