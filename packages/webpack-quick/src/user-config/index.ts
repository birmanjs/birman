import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import assert from 'assert';
import chalk from 'chalk';
import didyoumean from 'didyoumean2';
import { clearConsole } from '@birman/utils';
import stripJsonComments from 'strip-json-comments';
import { isPlainObject, isEqual } from 'lodash';
import { watch, unwatch } from './watch';
import * as configs from './configs';

interface Options {
  cwd: string;
}

const getUserConfig = () => {
  console.log(configs);
};

export default getUserConfig;
