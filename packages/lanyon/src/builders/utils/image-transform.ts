import imagemin from 'imagemin';
import webp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { BuildBuilderSchema } from '../build/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { getSystemPath, join, normalize, Path, basename, extname, dirname } from '@angular-devkit/core';
import glob from 'glob';
import { promisify } from 'util';
import { createDirectory, toFileName } from '@nrwl/workspace';

const globAsync = promisify(glob);

export async function optimizeImages(options: BuildBuilderSchema,
                                     context: BuilderContext) {
  const metadata = await context.getProjectMetadata(context.target);
  const sourceRoot: Path = normalize(`${context.workspaceRoot}/${metadata.sourceRoot}`);

  const ASSETS_DIR = getSystemPath(join(sourceRoot, 'assets/img'));

  //const files = await generateWebpForFilesInFolder(ASSETS_DIR);
  //context.logger.info(`Images optimized: ${files.length}`);

  const files = await globAsync(join(sourceRoot, 'assets/img/**/*.png'), {});

  files.forEach(file => {
    const filenameWithExt = file.split('\\').pop().split('/').pop();
    const name = filenameWithExt.split('.')[0];
    const fileExt = extname(normalize(file));

    context.logger.info(dirname(normalize(file)))
    context.logger.info(`${toFileName(name)} - ${fileExt}`);
  });
}

async function generateWebpForFilesInFolder(folderPath: string): Promise<imagemin.Result[]> {
  return imagemin([`${folderPath}/*.{png, jpeg}`], {
    destination: `${folderPath}/generated`,
    plugins: [
      webp({
        quality: 85
      }),
      imageminPngquant({
        quality: [0.5, 0.8]
      }),
      imageminMozjpeg({
        quality: 85
      })
    ]
  });
}
