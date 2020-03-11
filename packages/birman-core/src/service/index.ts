import { join } from 'path';
import { existsSync } from 'fs';
import { EventEmitter } from 'events';
import assert from 'assert';
import { BabelRegister, NodeEnv, lodash } from '@birman/utils';
import { AsyncSeriesWaterfallHook } from 'tapable';
