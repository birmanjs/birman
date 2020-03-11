import ejs from 'ejs';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import assert from 'assert';
import { cheerio } from '@birman/utils';
import prettier from 'prettier';
import { ConfigType } from '../config/types';
import { Opts } from './types';

export default class Html {
  config: ConfigType;
  tplPath?: string;

  constructor(opts: Opts) {
    this.config = opts.config;
    this.tplPath = opts.tplPath;
  }

  getHtmlPath(path: string) {
    if (path === '/') {
      return 'index.html';
    }

    // remove first and last slash
    path = path.replace(/^\//, '');
    path = path.replace(/\/$/, '');

    if (this.config.exportStatic?.htmlSuffix || path === 'index.html') {
      return `${path}`;
    } else {
      return `${path}/index.html`;
    }
  }
}
