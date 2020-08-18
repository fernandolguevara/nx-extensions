
export interface RenderedBlog {
  title: string;
  author: string;
  email: string;
  slug: string;
  date: string;
  contents: string;
  featuredImage: string;
  featuredImageAlt: string;

  // The actual rendered HTML (preview and body)
  preview: string;
  html: string;

  // All frontmatter attrs just in casesies
  meta?: any;
}
