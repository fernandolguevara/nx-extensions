import { Component, h, Listen } from '@stencil/core';

import state, { ModeType } from '../../store';

@Component({
  tag: 'mode-switch'
})
export class ModeSwitch {

  @Listen('click', { capture: true })
  switchMode() {
    if (state.pageTheme == ModeType.Light) {
      state.pageTheme = ModeType.Dark;
    } else {
      state.pageTheme = ModeType.Light;
    }
  }

  render() {
    return (
      <button class="p-1 border-2 border-transparent text-modeswitch-primary rounded-full hover:text-white focus:outline-none focus:text-white bg-modeswitch-secondary transition duration-150 ease-in-out"
        aria-label="Light/Dark mode switch">
        {state.pageTheme == ModeType.Dark
          ? <svg viewBox="0 0 20 20" fill="currentColor" class="sun w-6 h-6">
            <path fill-rule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clip-rule="evenodd"></path>
          </svg>
          : <svg viewBox="0 0 20 20" fill="currentColor" class="moon w-6 h-6">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        }
      </button>
    );
  }
}
