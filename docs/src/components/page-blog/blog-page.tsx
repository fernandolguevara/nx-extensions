import { Component, State, h } from '@stencil/core';
import { RenderedBlog } from '../../models';
import { BlogPostPreview } from './blog-common';

import posts from '../../assets/generated/blog/list.json';


@Component({
  tag: 'blog-page'
})
export class BlogPage {
  @State() posts?: RenderedBlog[];

  async componentWillLoad() {
    this.posts = (posts as RenderedBlog[]).slice(0, 10);
  }

  render() {
    if (this.posts) {
      return (
        <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          {posts.map(post => <BlogPostPreview post={post}/>)}
        </div>
      );
    }

    return null;
  }
}
