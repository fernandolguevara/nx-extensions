import { Component, ComponentInterface, h, Prop, State, Watch } from '@stencil/core';
import Helmet from '@stencil/helmet';

import siteStructure from '../../assets/generated/docs-structure.json';
import { findItem } from '../../global/site-structure-utils';
import { SiteStructureItem } from '../../global/definitions';
import { handleRoutableLinkClick } from '../../utils/route-link';

@Component({
  tag: 'docs-page'
})
export class DocsPage implements ComponentInterface {

  @Prop() pages: string[] = [];

  @Prop() page: string = null;

  @State() item: SiteStructureItem;
  @State() nextItem: SiteStructureItem;
  @State() prevItem: SiteStructureItem;
  @State() parent: SiteStructureItem;

  componentWillLoad() {
    return this.fetchNewContent(this.page);
  }

  @Watch('page')
  fetchNewContent(page: string, oldPage?: string) {
    if (page == null || page === oldPage) {
      return;
    }
    const foundData = findItem(siteStructure as SiteStructureItem[], this.page);
    this.item = foundData.item;
    this.nextItem = foundData.nextItem;
    this.prevItem = foundData.prevItem;
    this.parent = foundData.parent;
  }

  render() {
    if (this.item == null) {
      return <h1>Page not found</h1>;
    }
    return (
      <div>
        <docs-menu
          class="pt-10 pb-10"
          selectedParent={this.parent}
          siteStructureList={siteStructure as SiteStructureItem[]}
        />

        <app-marked class="pt-10 pb-10" fetchPath={this.item.filePath} renderer={(docsContent) => [
            <Helmet>
              <title>
                {docsContent.title ? `${docsContent.title} - Nxext` : 'Nxext'}
              </title>
            </Helmet>,

            <div class="prose">
              <div onClick={handleRoutableLinkClick} innerHTML={docsContent.content}></div>

              <lower-content-nav next={this.nextItem} prev={this.prevItem}></lower-content-nav>
            </div>,
          ]}
        />
      </div>
    );
  }
}
