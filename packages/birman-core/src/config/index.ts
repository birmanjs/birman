import { existsSync } from 'fs';
import { extname, join } from 'path';
import {
  chalk,
  chokidar,
  compatESModuleRequire,
  deepmerge,
  lodash,
  parseRequireDeps,
  winPath,
  createDebug
} from '@birman/utils';
import assert from 'assert';
import joi from '@hapi/joi';
