import { createStore } from "@stencil/store";

export interface State {
  menuShown: boolean;
  pageTheme: 'light' | 'mode-dark';
  prismLanguagesLoaded: any;
}

const { state } = createStore({
  menuShown: false,
  pageTheme: 'mode-dark',
  prismLanguagesLoaded: {
  }
} as State);

export default state;
