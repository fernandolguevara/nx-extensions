import { Component, ComponentInterface, Host, h, State } from '@stencil/core';

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss',
  scoped: true
})
export class DocsSearch implements ComponentInterface {

  @State() searchTerm: string = '';
  @State() searchResults: any = [];

  // <search-bar debounce={500} searchTerm={this.searchTerm} placeholder={'Search Docs'}></search-bar>

  render() {
    return (
      <Host></Host>
    );
  }
}
