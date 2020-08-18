import { Component, h, Host, State } from '@stencil/core';
import Helmet from '@stencil/helmet';
import { Tabs, Tab, TabBar, TabBarButton } from '../../utils/tabs';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss',
  scoped: true
})
export class LandingPage {
  @State() selectedCodeTab: string = 'notifications';

  render() {
    return (
      <Host>
        <Metadata/>

        <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">

        </div>
      </Host>
    );
  }
}

const Metadata = () => (
  <Helmet>
    <title>Nxext - StencilJs now with Nx</title>
    <meta
      name="description"
      content={'Build StencilJS project in Nx'}
    />
    <meta
      property="og:description"
      content="Build StencilJS project in Nx"
    />
    <meta property="og:site_name" content="Nxext"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content="@dominik_pieper"/>
    <meta name="twitter:creator" content="dominik_pieper"/>
    <meta name="twitter:title" content="Build StencilJS apps and libs in Nxdevtools"/>
    <meta name="twitter:description" content="Build StencilJS apps and libs in Nxdevtools"/>
    <meta name="twitter:image" content="https://capacitorjs.com/assets/img/og.png"/>
    <meta property="og:image" content="https://capacitorjs.com/assets/img/og.png"/>
    <meta property="og:url" content="https://nxext.dev/"/>
  </Helmet>
);
