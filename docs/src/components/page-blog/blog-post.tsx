import { Component, Prop, State, h, Host } from '@stencil/core';

import { RenderedBlog } from '../../models';
import { BlogPost } from './blog-common';

import posts from '../../assets/generated/blog/list.json';
import { href } from 'stencil-router-v2';
import Helmet from '@stencil/helmet';

@Component({
  tag: 'blog-post'
})
export class BlogPage {
  @Prop() slug: string;

  @State() post?: RenderedBlog;

  async componentWillLoad() {
    const { slug } = this;

    if (slug) {
      this.slug = slug;
      this.post = (posts as RenderedBlog[]).find(p => p.slug === this.slug);
    }
  }

  render() {
    if (this.slug && this.post) {
      return (
        <Host>
          <Helmet>
            <title>{this.post.title} - Nxext Blog - </title>
            <meta
              name="description"
              content={this.post.preview}
            />
            <meta name="twitter:description" content={`${this.post.preview} - Capacitor Blog`}/>
            <meta property="og:image"
                  content={this.post.meta.featuredImage || 'https://capacitorjs.com/assets/img/og.png'}/>
          </Helmet>

          <div class="blog-posts">
            <hgroup class="blog-posts__heading">
              <h3><a {...href('/blog')}>Blog</a></h3>
            </hgroup>
            <BlogPost post={this.post}/>
          </div>
        </Host>
      );
    }
    return null;
  }
}
