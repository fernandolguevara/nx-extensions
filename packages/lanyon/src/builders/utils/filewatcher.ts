import chokidar from 'chokidar';
import { readFileSync, unlinkSync } from 'fs-extra';
import { BuildBuilderSchema } from '../build/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { normalize, Path, join, getSystemPath, basename } from '@angular-devkit/core';
import { convertFile } from './doc-generator';
import { SiteStructureItem } from './definitions';
import { fromEvent, from, Observable } from 'rxjs';
import { finalize, mergeMap, first, tap } from 'rxjs/operators';

export function watchFiles(
  options: BuildBuilderSchema,
  context: BuilderContext
): Observable<any> {
  //const metadata = await context.getProjectMetadata(context.target);
  //const sourceRoot: Path = normalize(`${context.workspaceRoot}/${metadata.sourceRoot}`);
  const sourceRoot: Path = normalize(`${context.workspaceRoot}/docs/src`);
  const SOURCE_DIR = getSystemPath(join(sourceRoot, 'docs'));

  const DESTINATION_DIR = getSystemPath(join(sourceRoot, 'assets/generated/docs'));
  const SITE_STRUCTURE = getSystemPath(join(sourceRoot, 'assets/generated/docs-structure.json'));

  const siteStructure = readFileSync(SITE_STRUCTURE, { encoding: 'utf8' });
  const siteStructureJson: SiteStructureItem[] = JSON.parse(siteStructure);

  const watcher = chokidar.watch(join(sourceRoot, '**', '*.md'));
  let pathsToDelete: string[] = [];

  watcher
    .on('add', async (path: string) => {
      const jsonFile = await convertFile(SOURCE_DIR, DESTINATION_DIR, siteStructureJson, path);
      pathsToDelete.push(jsonFile);
    })
    .on('change', async (path: string) => {
      const jsonFile = await convertFile(SOURCE_DIR, DESTINATION_DIR, siteStructureJson, path);
      context.logger.info(`Updated file: ${basename(normalize(path))}`);
      pathsToDelete.push(jsonFile);
    })
    .on('unlink', async (path: string) => {
      const jsonFile = await removeFile(path);
      pathsToDelete = pathsToDelete.filter(path => path !== jsonFile);
    });

  // cleanup on ctrl+c
  process.on('SIGINT', () => {
    clearFiles(pathsToDelete);
    watcher.close();
    process.exit(0);
  });

  return fromEvent(watcher, 'ready').pipe(
    tap(() => {
      context.logger.info('Watching for markdown changes...');
    }),
    first(),
    mergeMap(() => from(context.scheduleTarget({ target: 'serve-stencil', project: 'docs' }))),
    mergeMap(target => target.output.pipe(
      finalize(() => {
        clearFiles(pathsToDelete);
        watcher.close();
      })
    ))
  );
}

function clearFiles(filesToDelete: string[]) {
  filesToDelete.forEach(removeFile);
}

function removeFile(filePath: string): string {
  try {
    unlinkSync(filePath);
  } catch (e) {
    // do nothing
  }

  return filePath;
}
