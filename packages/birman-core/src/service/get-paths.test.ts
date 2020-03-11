import { lodash, winPath } from '@birman/utils';
import { join, relative } from 'path';
import getPaths from './get-paths';
import { ServicePaths } from '@birman/types';

const fixtures = join(__dirname, 'fixtures');

function stripCwd(paths: ServicePaths, cwd: string) {
  return lodash.mapValues(paths, (value) => {
    return value.startsWith('@') ? value : winPath(relative(cwd, value));
  });
}

test('empty', () => {
  const cwd = join(fixtures, 'getPaths-empty');
  expect(
    stripCwd(
      getPaths({
        cwd,
        config: {},
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    absNodeModulesPath: 'node_modules',
    absOutputPath: 'dist',
    absPagesPath: 'pages',
    absSrcPath: '',
    absTmpPath: '.birman',
    cwd: ''
  });
});

test('empty production', () => {
  const cwd = join(fixtures, 'getPaths-empty');
  expect(
    stripCwd(
      getPaths({
        cwd,
        config: {},
        env: 'production'
      }),
      cwd
    )
  ).toEqual({
    absNodeModulesPath: 'node_modules',
    absOutputPath: 'dist',
    absPagesPath: 'pages',
    absSrcPath: '',
    absTmpPath: '.birman-production',
    cwd: ''
  });
});

test('empty config singular', () => {
  const cwd = join(fixtures, 'getPaths-empty');
  expect(
    stripCwd(
      getPaths({
        cwd,
        config: {
          singular: true
        },
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    absNodeModulesPath: 'node_modules',
    absOutputPath: 'dist',
    absPagesPath: 'page',
    absSrcPath: '',
    absTmpPath: '.birman',
    cwd: ''
  });
});

test('empty config outputPath', () => {
  const cwd = join(fixtures, 'getPaths-empty');
  expect(
    stripCwd(
      getPaths({
        cwd,
        config: {
          outputPath: './www'
        },
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    absNodeModulesPath: 'node_modules',
    absOutputPath: 'www',
    absPagesPath: 'pages',
    absSrcPath: '',
    absTmpPath: '.birman',
    cwd: ''
  });
});

test('src', () => {
  const cwd = join(fixtures, 'getPaths-with-src');
  expect(
    stripCwd(
      getPaths({
        cwd,
        config: {},
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    absNodeModulesPath: 'node_modules',
    absOutputPath: 'dist',
    absPagesPath: 'src/pages',
    absSrcPath: 'src',
    absTmpPath: 'src/.birman',
    cwd: ''
  });
});

test('src config singular', () => {
  const cwd = join(fixtures, 'getPaths-with-src');
  expect(
    stripCwd(
      getPaths({
        cwd,
        config: {
          singular: true
        },
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    absNodeModulesPath: 'node_modules',
    absOutputPath: 'dist',
    absPagesPath: 'src/page',
    absSrcPath: 'src',
    absTmpPath: 'src/.birman',
    cwd: ''
  });
});
