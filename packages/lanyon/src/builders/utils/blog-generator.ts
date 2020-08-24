import { BuildBuilderSchema } from '../build/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { ensureDir, readFile, writeFile } from 'fs-extra';
import marked from 'marked';
import frontMatter  from 'front-matter';
import { getSystemPath, join, normalize, Path } from '@angular-devkit/core';
import { promisify } from 'util';
import glob from 'glob';
import Prism from 'prismjs';

const globAsync = promisify(glob);

export async function generateBlogPosts(
  options: BuildBuilderSchema,
  context: BuilderContext
) {
  const metadata = await context.getProjectMetadata(context.target);
  const sourceRoot: Path = normalize(`${context.workspaceRoot}/${metadata.sourceRoot}`);

  const SOURCE_DIR = getSystemPath(join(sourceRoot, 'blog'));
  const DESTINATION_DIR = getSystemPath(join(sourceRoot, 'assets/generated/blog'));
  const BLOG_LIST_FILE = getSystemPath(join(sourceRoot, 'assets/generated/blog/list.json'));

  try {
    await ensureDir(DESTINATION_DIR);
  } catch (e) {
    context.logger.error(`Can't create dir: ${DESTINATION_DIR}`);
  }

  context.logger.info(`Searching blogposts blog/**/*.md`);

  const files = await globAsync(`${SOURCE_DIR}/**/*.md`, {});
  let allBlogPosts: RenderedBlog[] = await Promise.all(files.map(buildPost));
  allBlogPosts = allBlogPosts.filter(post => post != null);

  allBlogPosts.sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date);
  });

  await writeFile(BLOG_LIST_FILE, JSON.stringify(allBlogPosts, null, 2), {
    encoding: 'utf8'
  });

  context.logger.info(`Converted ${allBlogPosts.length} blogposts successfully`);
}

export interface RenderedBlog {
  title: string;
  author: string;
  email: string;
  slug: string;
  date: string;
  contents: string;
  featuredImage: string;
  featuredImageAlt: string;
  preview: string;
  html: string;
  meta?: any;
}


async function buildPost(filePath: string): Promise<RenderedBlog> {
  const contents = await readFile(filePath, { encoding: 'utf8' });

  const data = frontMatter<any>(contents);

  const slug = slugify(data.attributes.title);

  const authorString = data.attributes.author as string;
  const featuredImage = data.attributes.featuredImage as string;
  const featuredImageAlt = data.attributes.featuredImageAlt as string;

  const emailIndex = authorString.indexOf('<');
  const author = authorString.slice(0, emailIndex).trim();
  const email = authorString.slice(emailIndex + 1, authorString.indexOf('>')).trim();

  // Use the "more" token system to generate a preview on the index page
  const MORE_TOKEN = '<!--more-->';
  const moreIndex = data.body.indexOf(MORE_TOKEN);
  const postPreview = moreIndex >= 0 ? data.body.slice(0, moreIndex) : '';
  const postBody = moreIndex >= 0 ? data.body.slice(moreIndex + MORE_TOKEN.length) : data.body;

  if(data.attributes.published === undefined) {
    // Log notice to add the published flag
  }

  if(!data.attributes.published) {
    return Promise.resolve(null);
  }

  const parsedPreview = marked(postPreview, {
    highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang], lang as any)
  })
    // TODO: could support over vars but for now just replace $POST with the
    // final URL of the post
    .replace(/\$POST/g, `/blog/${slug}`);

  const parsedBody = marked(postBody, {
    highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang], lang as any)
  });

  return {
    title: data.attributes.title,
    author,
    email,
    slug,
    featuredImage,
    featuredImageAlt,
    date: (data.attributes.date as Date).toISOString(),
    contents: contents,
    preview: parsedPreview,
    html: parsedBody,
    meta: data.attributes
  } as RenderedBlog;
}

export function slugify(text: string) {
  if (!text) {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/\.+/g, '-') // Replace periods with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
