import 'dotenv';
import marked from 'marked';
import glob from 'glob';
import { promisify } from 'util';
import path from 'path';
import { readFile, writeFile, mkdirp, remove } from 'fs-extra';

import { collectHeadingMetadata, changeCodeCreation, localizeMarkdownLink } from './markdown-renderer';
import frontMatter from 'front-matter';
import lunr from 'lunr';
import { MarkdownContent, SiteStructureItem } from './definitions';
import { BuildBuilderSchema } from '../build/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { getSystemPath, join, normalize, Path } from '@angular-devkit/core';

const globAsync = promisify(glob);

export async function generateDocs(
  options: BuildBuilderSchema,
  context: BuilderContext
) {
  const metadata = await context.getProjectMetadata(context.target);
  const sourceRoot: Path = normalize(`${context.workspaceRoot}/${metadata.sourceRoot}`);
  const SOURCE_DIR = getSystemPath(join(sourceRoot, 'docs'));

  const DESTINATION_DIR = getSystemPath(join(sourceRoot, 'assets/generated/docs'));
  const SITE_STRUCTURE = getSystemPath(join(sourceRoot, 'assets/generated/docs-structure.json'));

  const siteStructure = await readFile(SITE_STRUCTURE, { encoding: 'utf8' });
  const siteStructureJson: SiteStructureItem[] = JSON.parse(siteStructure);

  context.logger.info(`Searching documentation files docs/**/*.md`);
  const files = await globAsync(`docs/**/*.md`, {});
  const indexRecords = [];

  await remove(DESTINATION_DIR);

  const filePromises = files.map(filePath => convertFile(SOURCE_DIR, DESTINATION_DIR, siteStructureJson, filePath));

  await Promise.all(filePromises);

  context.logger.info(`Converted ${filePromises.length} files successfully`);

  const SITE_SEARCH_INDEX = getSystemPath(join(sourceRoot, 'assets/generated/lunr-search-index.json'));
  const SITE_SEARCH_CONTENT = getSystemPath(join(sourceRoot, 'assets/generated/lunr-search-content.json'));

  const idx = lunr(function() {
    this.ref('url');
    this.field('title');
    this.field('description');
    this.field('content');

    indexRecords.forEach(doc => {
      this.add(doc);
    });
  });

  await writeFile(SITE_SEARCH_INDEX, JSON.stringify(idx), { encoding: 'utf8' });
  await writeFile(SITE_SEARCH_CONTENT, JSON.stringify(indexRecords), { encoding: 'utf8' });
  context.logger.info('search index created');
}

export async function convertFile(SOURCE_DIR: string, DESTINATION_DIR: string, siteStructureJson: SiteStructureItem[], filePath: string): Promise<string> {
  if (filePath === './docs/src/docs/toc.md') {
    return Promise.resolve(null);
  }
  let htmlContents = '';
  const markdownMetadata: MarkdownContent = {};
  const jsonFileName = path.relative(SOURCE_DIR, filePath);
  const destinationFileName = path.join(
    DESTINATION_DIR,
    path.dirname(jsonFileName),
    path.basename(jsonFileName, '.md') + '.json'
  );
  markdownMetadata.headings = [];

  const markdownContents = await readFile(filePath, { encoding: 'utf8' });

  try {
    const parsedMarkdown = frontMatter<any>(markdownContents);

    const renderer = new marked.Renderer();

    collectHeadingMetadata(renderer, markdownMetadata);
    changeCodeCreation(renderer);
    localizeMarkdownLink(renderer, destinationFileName.replace('src', ''), siteStructureJson);

    htmlContents = marked(parsedMarkdown.body, {
      renderer,
      headerIds: true
    }).trim();

    await mkdirp(path.join(
      DESTINATION_DIR,
      path.dirname(jsonFileName)
    ));

    const data = {
      ...parsedMarkdown.attributes as any,
      ...markdownMetadata,
      srcPath: filePath,
      content: htmlContents
    };

    await writeFile(destinationFileName, JSON.stringify(data), {
      encoding: 'utf8'
    });

    return destinationFileName;
  } catch (e) {
    console.error(filePath);
    throw e;
  }
}
