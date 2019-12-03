import Config from 'webpack-chain';
import { ProgressPlugin, DevtoolModuleFilenameTemplateInfo } from 'webpack';
import { join, resolve, relative } from 'path';
import { EOL } from 'os';
import { existsSync } from 'fs';

interface Options {
  // 当前工作目录
  cwd: string;
  // 是否是开发环境
  isDev: boolean;
  // 输出路径
  outputPath: string;
  // 公有路径（静态资源文件所在的路径）
  publicPath: string;
  // 别名
  alias: {
    [key: string]: string
  }
}

const getWebpackConfig = (opts: Options) => {
  const { cwd, alias, publicPath, outputPath } = opts;
  const isDev = opts.isDev || process.env.NODE_ENV === 'development';

  const webpackConfig = new Config();

  // 模式 可选值: development、production
  webpackConfig.mode('development');

  // 输出
  // 输出路径 - 默认为dist目录
  const absOutputPath = resolve(cwd, outputPath || 'dist');

  webpackConfig.output
    // output目录 (绝对路径)
    .path(absOutputPath)
    // 决定了每个输出 bundle 的名称
    .filename(`[name].js`)
    // 决定了非入口 chunk 文件的名称
    .chunkFilename(`[name].async.js`)
    // 公有路径
    .publicPath(publicPath)
    .devtoolModuleFilenameTemplate((info: DevtoolModuleFilenameTemplateInfo) => {
      return relative(opts.cwd, info.absoluteResourcePath).replace(/\\/g, '/');
    });

  // 解析
  webpackConfig.resolve
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(join(__dirname, '../../node_modules'))
    .add(join(__dirname, '../../../'))
    .end()
    .extensions.merge([
      '.web.js',
      '.wasm',
      '.mjs',
      '.js',
      '.web.jsx',
      '.jsx',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json',
    ]);

  // 设置别名
  if (opts.alias) {
    for (const key in alias) {
      webpackConfig.resolve.alias.set(key, alias[key]);
    }
  }
}

export default getWebpackConfig;
