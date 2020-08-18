import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, from } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BuildBuilderSchema } from './schema';
import { generateSiteStructure } from '../utils/site-generator';
import { generateDocs } from '../utils/doc-generator';
import { generateBlogPosts } from '../utils/blog-generator';

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return from(generateSiteStructure(options, context)).pipe(
    switchMap(() => from(generateDocs(options, context))),
    switchMap(() => from(generateBlogPosts(options, context))),
    map(() => ({ success: true })),
    tap(() => context.logger.info('Builder ran for build'))
  );
}

export default createBuilder(runBuilder);
