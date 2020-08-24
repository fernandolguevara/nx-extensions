import { h } from '@stencil/core';
import { href } from 'stencil-router-v2';

import Router from '../../router';

import { RenderedBlog } from '../../models';

const getBlogPostPath = (doc: RenderedBlog) => `/blog/${doc.slug}`;
// const getAbsoluteBlogPostUrl = (doc: RenderedBlog) => `https://capacitorjs.com${getBlogPostPath(doc)}`;

export const BlogPost = ({ post, single = true }: { post: RenderedBlog, single?: boolean }) => {
  const content = single ? post.html : post.preview || post.html;

  return [
    <div class="w-full md:w-3/5 mx-auto prose">
      <div class="mx-5 my-3 text-sm">
        <a href="" class=" text-red-600 font-bold tracking-widest">
          CORONAVIRUS
        </a>
      </div>
      <div class="w-full text-gray-800 text-4xl px-5 font-bold leading-none">
        Kemp and Bottoms hurl insults at each other in Georgia mask feud
      </div>

      <div class="w-full text-gray-500 px-5 pb-5 pt-2">
        The war of words comes after the governor sued the Atlanta mayor over
        her city’s mask mandate.
      </div>

      <div class="mx-5">
        <img src="https://static.politico.com/dims4/default/fcd6d6a/2147483647/resize/1920x/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F22%2F87%2F2259ffd444678054896b9fa32b4d%2Fgettyimages-1221513169.jpg" />
      </div>

      <div class="w-full text-gray-600 text-normal mx-5">
        <p class="border-b py-3">
          Georgia Gov. Brian Kemp speaks to the media during a press conference.
          | Kevin C. Cox/Getty Images
        </p>
      </div>

      <div class="w-full text-gray-600 font-thin italic px-5 pt-3">
        By <strong class="text-gray-700">Quint Forgey</strong>
        <br />
        07/17/2020 09:57 AM EDT
        <br />
        Updated: 07/17/2020 10:33 AM EDT
      </div>

      <PostContent html={content}></PostContent>
    </div>
  ];
};

/*
const PostFeaturedImage = ({ post }: { post: RenderedBlog }) => (
  <img class="blog-post__featured-image" src={post.featuredImage} alt={post.featuredImageAlt}/>
);
*/

const PostContent = ({ html }: { html: string }) => (
  <div innerHTML={html}/>
);

const PostContinueReading = ({ post }: { post: RenderedBlog }) =>
  <a class="text-blue-500 text-xs -ml-3" {...href(getBlogPostPath(post), Router)}>Continue reading <svg
    viewBox="0 0 20 20" fill="currentColor" class="arrow-narrow-right inline w-4 h-4">
    <path fill-rule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"></path></svg>
  </a>;

const PostAuthor = ({ authorName, dateString }: { authorName: string, dateString: string }) => {
  return (
    <div class="author flex items-center -ml-3 my-3">
      <div class="user-logo">
        <img class="w-12 h-12 object-cover rounded-full mx-4  shadow"
             src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80"
             alt="avatar" />
      </div>

      <h2 class="text-sm tracking-tighter text-gray-900">
        <a href="#">By {authorName}</a> <span class="text-gray-600">{dateString}.</span>
      </h2>
    </div>
  );
};

export const BlogPostPreview = ({ post }: { post: RenderedBlog }) => {
  return (
    <div class="mx-auto px-4 py-8 max-w-xl">
      <div class="bg-white shadow-2xl rounded-lg mb-6 tracking-wide">
        <div class="md:flex-shrink-0">
          <img src="https://ik.imagekit.io/q5edmtudmz/post1_fOFO9VDzENE.jpg" alt="mountains"
               class="w-full h-64 rounded-lg rounded-b-none"/>
        </div>
        <div class="px-4 py-2 mt-2">
          <h2 class="font-bold text-2xl text-gray-800 tracking-normal">
            {post.title}
          </h2>
          <p class="text-sm text-gray-700 px-2 mr-1">
            <PostContent html={post.preview}></PostContent>
          </p>
          <div class="flex items-center justify-between mt-2 mx-6">
            <PostContinueReading post={post}/>
          </div>
          <PostAuthor authorName={post.author} dateString={post.date}></PostAuthor>
        </div>
      </div>
    </div>
  );
};
