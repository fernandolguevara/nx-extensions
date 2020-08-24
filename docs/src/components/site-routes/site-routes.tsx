import { Component, ComponentInterface, h, Host } from '@stencil/core';
import { match, Route } from 'stencil-router-v2';
import { InternalRouterState } from 'stencil-router-v2/dist/types';

import state from '../../store';
import Router from '../../router';

@Component({
  tag: 'site-routes'
})
export class SiteRoutes implements ComponentInterface {

  componentWillLoad() {
    let oldUrl: URL;

    Router.onChange('url', (newValue: InternalRouterState['url'], _oldValue: InternalRouterState['url']) => {
      if (!oldUrl || oldUrl.pathname !== newValue.pathname) {
        state.menuShown = false;
      }

      oldUrl = newValue;

      requestAnimationFrame(() => window.scrollTo(0, 0));
    });
  }

  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <landing-page />
          </Route>

          <Route path="/docs">
            <docs-page page="/docs" />
          </Route>

          <Route path={match('/docs/:pageName*')} render={({ pageName }) => (
            <docs-page page={`/docs/${pageName}`} />
          )} />
          <Route path={match('/blog', { exact: true })} render={() => {
            return <blog-page />
          }} />

          <Route path={match('/blog/:slug')} render={({ slug }) => {
            return <blog-post slug={slug} />
          }} />
        </Router.Switch>
      </Host>
    );
  }
}
