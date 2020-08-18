import { h } from '@stencil/core';
import { href } from 'stencil-router-v2';

import Router from '../../router';

import { RenderedBlog } from '../../models';

const getBlogPostPath = (doc: RenderedBlog) => `/blog/${doc.slug}`;
// const getAbsoluteBlogPostUrl = (doc: RenderedBlog) => `https://capacitorjs.com${getBlogPostPath(doc)}`;

export const BlogPost = ({ post, single = true }: { post: RenderedBlog, single?: boolean }) => {
  const content = single ?
                    post.html :
                    post.preview || post.html;

  return (
    <div class="blog-post__wrap">
      <div class="blog-post">
        <h2><a href={getBlogPostPath(post)}>{post.title}</a></h2>
        <PostAuthor authorName={post.author} authorUrl={post.email} dateString={post.date} />

        {post.meta.featuredImage && <PostFeaturedImage post={post} />}

        {post.meta.featuredImage}

        <PostContent html={content} />

        {!single && post.preview ? <PostContinueReading post={post} /> : null}
      </div>
    </div>
  )
}

const PostFeaturedImage = ({ post }: { post: RenderedBlog}) => (
  <img class="blog-post__featured-image" src={post.featuredImage} alt={post.featuredImageAlt} />
);

const PostContent = ({ html }: { html: string }) => (
  <div innerHTML={html} />
);

const PostContinueReading = ({ post }: { post: RenderedBlog }) =>
  <a class="blog-post__continue-reading" {...href(getBlogPostPath(post), Router)}>Continue reading <ion-icon name="arrow-forward" /></a>

const PostAuthor = ({ authorName, authorUrl, dateString }: { authorName: string, authorUrl: string, dateString: string }) => {
  return (
    <div class="blog-post__author">
      <span>By {authorUrl ?
        <a href={authorUrl} target="_blank">{authorName}</a> :
        authorName} on {dateString}</span>
    </div>
  );
}
