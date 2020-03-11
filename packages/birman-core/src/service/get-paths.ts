import { join } from 'path';
import { existsSync, statSync } from 'fs';
import { lodash, winPath } from '@birman/utils';
import { ServicePaths } from '@birman/types';

interface Opts {
  cwd: string;
  config: any;
  env?: string;
}

/**
 * 检查路径是否是文件夹并且存在
 * @param path
 */
function isDirectoryAndExist(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

function normalizeWithWinPath<T extends Record<any, string>>(obj: T) {
  return lodash.mapValues(obj, (value) => winPath(value));
}

export default function getServicePaths({ cwd, config, env }: Opts): ServicePaths {
  let absSrcPath = cwd;

  if (isDirectoryAndExist(join(cwd, 'src'))) {
    absSrcPath = join(cwd, 'src');
  }

  const absPagesPath = config.singular ? join(absSrcPath, 'page') : join(absSrcPath, 'pages');

  const tmpDir = ['.birman', env !== 'development' && env].filter(Boolean).join('-');

  return normalizeWithWinPath({
    cwd,
    absNodeModulesPath: join(cwd, 'node_modules'),
    absOutputPath: join(cwd, config.outputPath || './dist'),
    absSrcPath,
    absPagesPath,
    absTmpPath: join(absSrcPath, tmpDir)
  });
}
