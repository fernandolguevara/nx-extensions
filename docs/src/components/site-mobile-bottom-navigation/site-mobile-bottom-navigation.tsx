import { Component, ComponentInterface, h, VNode } from '@stencil/core';
import { href } from 'stencil-router-v2';
import Router from '../../router';

@Component({
  tag: 'site-mobile-bottom-navigation',
  scoped: true
})
export class SiteMobileBottomNavigation implements ComponentInterface {

  links: {name: string, path: string, icon: any}[] = [
    {
      name: 'Home',
      path: '/',
      icon: <svg viewBox="0 0 20 20" fill="currentColor" class="home w-6 h-6 inline">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
      </svg>
    },
    {
      name: 'Documentation',
      path: '/docs',
      icon: <svg viewBox="0 0 20 20" fill="currentColor" class="document-text w-6 h-6 inline">
        <path fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clip-rule="evenodd"></path>
      </svg>
    },
    {
      name: 'Blog',
      path: '/blog',
      icon: <svg viewBox="0 0 20 20" fill="currentColor" class="newspaper w-6 h-6 inline">
        <path fill-rule="evenodd"
              d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
              clip-rule="evenodd"></path>
        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
      </svg>
    }
  ];

  render() {
    return (
      <div
        class="w-full bg-blue-900 px-2 text-center fixed bottom-0 h-18 sm:visible md:invisible">
        <div class="mx-auto">
          <ul class="list-reset flex flex-row text-center">
            {this.links.map(link =>
              <li class="mr-3 mt-0 flex-1">
                <NavBottomLink path={link.path}>
                  {link.icon}

                  <span class="pb-0 text-xs text-gray-400 block">{link.name}</span>
                </NavBottomLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

interface NavLinkProps {
  path: string;
}

const NavBottomLink = ({ path }: NavLinkProps, children: VNode) => {
  const active = Router.activePath === path ||
    Router.activePath + Router.url.hash === path;

  return (
    <a
      {...href(path)} class={{
      'block py-1 md:py-3 pl-1 align-middle text-gray-400 no-underline hover:text-yellow-600 border-b-2 border-gray-800 hover:border-yellow-600': true,
      'text-yellow-600 border-yellow-600': active
    }}>
      {children}
    </a>
  );
};
