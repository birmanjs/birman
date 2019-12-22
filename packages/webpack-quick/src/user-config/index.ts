import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import assert from 'assert';
import didyoumean from 'didyoumean2';
import stripJsonComments from 'strip-json-comments';
import { isPlainObject, isEqual } from 'lodash';

interface Options {
  cwd: string;
}

const getUserConfig = () => {};

export default getUserConfig;
