import {
  Component,
  Element,
  State,
  h,
  ComponentInterface,
  Listen,
  VNode,
} from '@stencil/core';

import Router from '../../router';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'site-navigation',
})
export class SiteNavigation implements ComponentInterface {
  @Element() el: HTMLElement;

  @State() forceHovered: string | null = null;
  @State() hovered: string | null = null;
  @State() onTopOfPage: boolean = true;

  routes: Route[] = [
    {
      name: 'Home',
      path: '/',
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          class="home w-6 h-6 inline"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
      ),
    },
    {
      name: 'Documentation',
      path: '/docs',
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          class="document-text w-6 h-6 inline"
        >
          <path
            fill-rule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      name: 'Blog',
      path: '/blog',
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          class="newspaper w-6 h-6 inline"
        >
          <path
            fill-rule="evenodd"
            d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
            clip-rule="evenodd"
          ></path>
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
        </svg>
      ),
    },
  ];

  async componentWillLoad() {
    this.forceHovered = Router.activePath.replace('/', '').replace('#', '');

    Router.onChange('activePath', (v: any) => {
      if (['/docs', '/blog'].findIndex((x) => x === v) >= 0) {
        this.forceHovered = v.replace('/', '').replace('#', '');
      }
    });
  }

  setHovered = (h: string) => () => (this.hovered = h);

  clearHover = () => (this.hovered = null);

  @Listen('scroll', { target: 'window' })
  handleScroll() {
    this.onTopOfPage = window.pageYOffset == 0;
  }

  render() {
    return [
      <nav class="bg-background-primary shadow-md z-50 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mb-5">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <docs-menu-toggle />
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0">
              <nxext-logo></nxext-logo>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex">
                {this.routes.map((route) => (
                  <NavLink
                    path={route.path}
                    hovered={this.hovered === route.name}
                    onHover={this.setHovered(route.name)}
                    onExit={this.clearHover}
                  >
                    {route.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <mode-switch></mode-switch>
          </div>
        </div>
      </nav>,

      <BottomNav routes={this.routes}></BottomNav>,
    ];
  }
}

interface Route {
  name: string;
  path: string;
  icon: any;
}

interface NavLinkProps {
  hovered: boolean;
  path: string;
  onHover: () => void;
  onExit: () => void;
}

const NavLink = (
  { path, hovered, onHover, onExit }: NavLinkProps,
  children: VNode
) => {
  // Detect active if path equals the route path or the current active path plus
  // the route hash equals the path, to support links like /#features
  const active =
    Router.activePath === path || Router.activePath + Router.url.hash === path;

  return (
    <a
      {...href(path)}
      onMouseOver={onHover}
      onMouseOut={onExit}
      class={{
        'ml-4 px-3 py-2 text-sm font-medium leading-5 text-textcolor hover:text-highlight-primary focus:outline-none focus:text-highlight-primary transition duration-150 ease-in-out': true,
        'px-3 py-2  text-sm font-medium leading-5 text-highlight-primary focus:outline-none focus:text-highlight-primary transition duration-150 ease-in-out': active,
        '': hovered,
      }}
    >
      {children}
    </a>
  );
};

interface NavBottomLinkProps {
  path: string;
}

const NavBottomLink = ({ path }: NavBottomLinkProps, children: VNode) => {
  const active =
    Router.activePath === path || Router.activePath + Router.url.hash === path;

  return (
    <a
      {...href(path)}
      class={{
        'block py-1 md:py-3 pl-1 align-middle text-textcolor no-underline hover:text-highlight-primary border-b-2 border-gray-800 hover:border-highlight-primary': true,
        'text-yellow-primary border-yellow-primary': active,
      }}
    >
      {children}
    </a>
  );
};

const BottomNav = ({ routes }: { routes: Route[] }) => {
  return (
    <div class="w-full bg-background-primary border-t-1 border-gray-800 px-2 text-center fixed bottom-0 h-18 z-50 sm:visible lg:invisible">
      <div class="mx-auto">
        <ul class="list-reset flex flex-row text-center">
          {routes.map((route) => (
            <li class="mr-3 mt-0 flex-1">
              <NavBottomLink path={route.path}>
                {route.icon}

                <span class="pb-0 text-xs text-textcolor block">
                  {route.name}
                </span>
              </NavBottomLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
