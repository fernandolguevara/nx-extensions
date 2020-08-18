import marked from 'marked';
import { BuilderContext } from '@angular-devkit/architect';
import { SiteStructureItem } from './definitions';
import { dirname, getSystemPath, join, normalize, Path } from '@angular-devkit/core';
import path from 'path';
import { listFactory } from './markdown-renderer';
import frontMatter from 'front-matter';
import { BuildBuilderSchema } from '../build/schema';
import { promisify } from 'util';
import fs from 'fs';
import { ensureDir } from 'fs-extra';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const ASSETS_DIR = '/assets/generated/docs';

export async function generateSiteStructure(
  options: BuildBuilderSchema,
  context: BuilderContext
) {

  const metadata = await context.getProjectMetadata(context.target);
  const sourceRoot: Path = normalize(`${context.workspaceRoot}/${metadata.sourceRoot}`);
  const TOC = getSystemPath(join(sourceRoot, 'docs/toc.md'));

  try {
    await ensureDir(getSystemPath(join(sourceRoot, 'assets/generated')));
  } catch (e) {
    context.logger.error('Dir can\'t be created');
  }

  const metadataList: SiteStructureItem[] = [];
  const markdownContents = await readFile(TOC, { encoding: 'utf8' });

  const renderer = new marked.Renderer();
  listFactory(renderer, metadataList);
  marked(markdownContents, {
    renderer
  });

  await walkUpdateChildren(metadataList, TOC);

  await writeFile(
    getSystemPath(join(sourceRoot, 'assets/generated/docs-structure.json')),
    JSON.stringify(metadataList, null, 2),
    {
      encoding: 'utf8'
    }
  );
}


async function walkUpdateChildren(itemList, sourcePath) {
  for (const item of itemList) {
    if (item.filePath && item.filePath.indexOf('//') === -1) {
      const fullPath = join(dirname(sourcePath), item.filePath);
      const url = await getMarkdownFileSitePath(fullPath);
      const jsonPath = join(
        normalize(ASSETS_DIR),
        dirname(item.filePath),
        path.basename(item.filePath, '.md') + '.json'
      );

      item.url = url;
      item.filePath = jsonPath;
    }
    if (item.children) {
      await walkUpdateChildren(item.children, sourcePath);
    }
  }
}

async function getMarkdownFileSitePath(filePath) {
  let markdownContents: any;
  try {
    markdownContents = await readFile(filePath, { encoding: 'utf8' });
  } catch (e) {
    return null;
  }

  if (!markdownContents) {
    return null;
  }
  const metadata: any = frontMatter(markdownContents);

  return (metadata && metadata.attributes ? metadata.attributes.url : null);
}
