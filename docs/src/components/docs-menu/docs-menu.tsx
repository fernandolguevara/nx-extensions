import { Component, ComponentInterface, Host, Prop, State, Watch, h } from '@stencil/core';
import { SiteStructureItem } from '../../global/definitions';
import { href } from 'stencil-router-v2';

import Router from '../../router';
import state from '../../store';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss',
  shadow: false,
  scoped: true
})
export class SiteMenu implements ComponentInterface {
  version: string;

  @Prop() siteStructureList: SiteStructureItem[] = [];
  @Prop({ mutable: true }) selectedParent: SiteStructureItem = null;

  @State() closeList = [];

  async componentWillLoad() {
    const parentIndex = this.siteStructureList.findIndex(item => item === this.selectedParent);
    this.closeList = this.siteStructureList.map((_item, i) => i).filter(i => i !== parentIndex);
  }

  @Watch('selectedParent')
  selectedParentChange() {
    const parentIndex = this.siteStructureList.findIndex(item => item === this.selectedParent);
    this.closeList = this.siteStructureList.map((_item, i) => i).filter(i => i !== parentIndex);
  }

  render() {
    return (
      <Host class={{ 'menu-overlay-visible': state.menuShown }}>
        <div
          class="w-full sticky inset-0 hidden h-64 md:h-auto overflow-x-hidden overflow-y-auto md:overflow-y-hidden md:block mt-0 border border-gray-400 md:border-transparent bg-white shadow md:shadow-none md:bg-transparent z-20">
          <ul class="list-reset">
            {this.siteStructureList.map((item) => {
              const active = item.url === Router.activePath;

              if (item.children) {
                return item.children.map((childItem) => {
                  return (
                    <li class="py-2 md:my-0 mr-5 ml-5 hover:bg-purple-100 md:hover:bg-transparent">
                      {(childItem.url) ?
                        <a {...href(childItem.url)}
                           class={{
                             'block pl-4 align-middle text-gray-700 no-underline hover:text-blue-700 border-l-4 border-transparent md:hover:border-blue-700': true,
                             'md:border-blue-700': childItem.url === Router.activePath
                           }}>
                          {childItem.text}
                        </a> :
                        <a rel="noopener" class="link--external" target="_blank" href={childItem.filePath}>
                          {childItem.text}
                        </a>}
                    </li>
                  );
                });
              }

              return (
                <li>
                  {(item.url) ?
                    <a {...href(item.url)} class={{'section-active': active}}>
                      <span class="section-active-indicator"/>
                      <span class="section-label">
                        {item.text}
                      </span>
                    </a> :
                    <a rel="noopener" class="link--external" target="_blank" href={item.filePath}>
                      {item.text}
                    </a>}
                </li>
              );
            })}
          </ul>
        </div>
      </Host>
    );
  }
}
