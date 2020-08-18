import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'site-footer',
  styleUrl: 'site-footer.css',
  scoped: true
})
export class SiteFooter {
  render() {
    return (
      <Host>
        <footer class="invisible md:visible bg-white w-full border-t border-gray-300 p-4 pin-b">
          <div class="container mx-auto px-6 py-2">
            <p>
              © {(new Date()).getFullYear()} <nxext-logo borderless></nxext-logo> | Released under <span id="mit">MIT License</span>
            </p>
          </div>
        </footer>
      </Host>
    );
  }
}
