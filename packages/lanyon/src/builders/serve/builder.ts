import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServeBuilderSchema } from './schema';
import { watchFiles } from '../utils/filewatcher';

function runBuilder(
  options: ServeBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    switchMap(() => watchFiles(options, context))
  );
}

export default createBuilder(runBuilder);
