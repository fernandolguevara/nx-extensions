import { createStore } from "@stencil/store";

export enum ModeType {
  Dark = 'dark',
  Light = 'light'
}

export interface State {
  menuShown: boolean;
  pageTheme: ModeType;
  prismLanguagesLoaded: any;
}

function detectUserModePreference(): ModeType {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ModeType.Dark
    : ModeType.Light;
}

const { state } = createStore({
  menuShown: false,
  pageTheme: detectUserModePreference(),
  prismLanguagesLoaded: {},
} as State);

export default state;
