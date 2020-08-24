import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'site-footer'
})
export class SiteFooter {
  render() {
    return (
      <Host>
        <footer class="invisible md:visible bg-background-primary w-full bottom-0">
          <div class="container mx-auto pt-6 pb-6">
            <p>
              © {(new Date()).getFullYear()} <nxext-logo inline></nxext-logo> | Released under <span id="mit">MIT License</span>
            </p>
          </div>
        </footer>
      </Host>
    );
  }
}
