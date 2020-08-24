import { Config } from '@stencil/core';
import dotenvPlugin from 'rollup-plugin-dotenv';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import tailwindcss  from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano'

export const config: Config = {
  taskQueue: 'async',
  globalStyle: 'src/global/app.css',
  outputTargets: [
    {
      type: 'www',
      baseUrl: 'http://localhost:3333/',
      prerenderConfig: './prerender.config.ts',
      serviceWorker: {
        unregister: true,
      }
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/prerender',
    },
  ],
  devServer: {
    reloadStrategy: 'pageReload'
  },
  plugins: [
    dotenvPlugin(),
    postcss({
      plugins: [
        tailwindcss('./docs/tailwind.config.js'),
        autoprefixer(),
        cssnano()
      ]
    }),
    sass()
  ],
};
