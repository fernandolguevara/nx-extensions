import { Component, Element, State, h, VNode, ComponentInterface, Listen } from '@stencil/core';
import { href } from 'stencil-router-v2';

import Router from '../../router';

@Component({
  tag: 'site-navigation'
})
export class SiteNavigation implements ComponentInterface {
  @Element() el: HTMLElement;

  @State() forceHovered: string | null = null;
  @State() hovered: string | null = null;
  @State() onTopOfPage: boolean = true;

  async componentWillLoad() {
    this.forceHovered = Router.activePath.replace('/', '').replace('#', '');

    Router.onChange('activePath', (v: any) => {
      if (['/docs', '/blog'].findIndex(x => x === v) >= 0) {
        this.forceHovered = v.replace('/', '').replace('#', '');
      }
    });
  }

  setHovered = (h: string) => () => this.hovered = h;

  clearHover = () => this.hovered = null;

  @Listen('scroll', { target: 'window' })
  handleScroll() {
    this.onTopOfPage = window.pageYOffset == 0;
  }

  render() {
    return (
      <nav class={'relative z-10 w-full h-24 px-12 bg-white flex justify-between transition duration-500 ease-in-out ' + (this.onTopOfPage ? 'shadow-none border-b border-gray-300' : 'shadow-md')}>
        <div class="container mx-auto px-6 py-2 flex justify-between items-center">
          <a {...href('/')}>
            <nxext-logo></nxext-logo>
          </a>

          <docs-menu-toggle />

          <div class="invisible md:visible">
            <ul class="flex">
              <li>
                <NavLink
                  path="/docs"
                  hovered={this.hovered === 'docs'}
                  onHover={this.setHovered('docs')}
                  onExit={this.clearHover}>
                  Docs
                </NavLink>
              </li>
              <li>
                <NavLink
                  path="/blog"
                  hovered={this.hovered === 'blog'}
                  onHover={this.setHovered('blog')}
                  onExit={this.clearHover}>
                  Blog
                </NavLink>

                <a class="ml-5" rel="noopener" target="_blank" href="https://github.com/nxext/nx-extensions" aria-label="GitHub">
                  <ion-icon class="transform scale-150" name="logo-github"></ion-icon>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

interface NavLinkProps {
  hovered: boolean;
  path: string;
  onHover: () => void;
  onExit: () => void;
}

const NavLink = ({ path, hovered, onHover, onExit }: NavLinkProps, children: VNode) => {
  // Detect active if path equals the route path or the current active path plus
  // the route hash equals the path, to support links like /#features
  const active = Router.activePath === path ||
    Router.activePath + Router.url.hash === path;

  return (
    <a
      {...href(path)}
      onMouseOver={onHover}
      onMouseOut={onExit}
      class={{
        'px-4 hover:text-blue-800': true,
        'font-bold': active,
        '': hovered
      }}>
      {children}
    </a>
  );
};
