import { join } from 'path';
import { existsSync } from 'fs';
import { EventEmitter } from 'events';
import assert from 'assert';
import Logger from '../logger';
import { BabelRegister, NodeEnv, lodash } from '@birman/utils';
import { AsyncSeriesWaterfallHook } from 'tapable';
import { pathToObj, resolvePlugins, resolvePresets } from './utils/plugin-utils';
import loadDotEnv from './utils/load-dot-env';
import { ServiceStage } from './enums';
import Config from '../config';
import { Command, Hook, Package, Plugin, Preset } from './types';
import { getUserConfigWithKey } from '../config/utils/config-utils';
import getPaths from './get-paths';

const logger = new Logger('@birman/core:service');

export interface ServiceOpts {
  cwd: string;
  pkg?: Package;
  presets?: string[];
  plugins?: string[];
  env?: NodeEnv;
}

type ConfigType = {
  presets?: string[];
  plugins?: string[];
  [key: string]: any;
};

export default class Service extends EventEmitter {
  cwd: string;
  pkg: Package;
  env: string | undefined;
  // babel register
  babelRegister: BabelRegister;
  // hooks
  hooksByPluginId: {
    [id: string]: Hook[];
  } = {};
  // registered commands
  commands: {
    [name: string]: Command | string;
  } = {};
  // including presets and plugins
  plugins: {
    [id: string]: Plugin;
  } = {};
  // lifecycle stage
  stage: ServiceStage = ServiceStage.uninitiialized;
  configInstance: Config;
  config: ConfigType | null = null;
  // user config
  userConfig: ConfigType;
  // paths
  paths: {
    cwd?: string;
    absNodeModulesPath?: string;
    absSrcPath?: string;
    absPagesPath?: string;
    absOutputPath?: string;
    absTmpPath?: string;
  } = {};
  // initial presets and plugins from arguments, config, process.env, and package.json
  initialPresets: Preset[];
  initialPlugins: Plugin[];
  // presets and plugins for registering
  _extraPresets: Preset[] = [];
  _extraPlugins: Plugin[] = [];

  constructor(opts: ServiceOpts) {
    super();

    logger.debug('opts:');
    logger.debug(opts);

    this.cwd = opts.cwd || process.cwd();
    this.pkg = opts.pkg || this.resolvePackage();
    this.env = opts.env || process.env.NODE_ENV;

    assert(existsSync(this.cwd), `cwd ${this.cwd} does not exist.`);

    // register babel before config parsing
    this.babelRegister = new BabelRegister();

    // load .env or .local.env
    logger.debug('load env');
    this.loadEnv();

    // get user config without validation
    logger.debug('get user config');
    this.configInstance = new Config({
      cwd: this.cwd,
      service: this,
      localConfig: this.env === 'development'
    });
    this.userConfig = this.configInstance.getUserConfig();
    logger.debug('userConfig:');
    logger.debug(this.userConfig);

    // get paths
    this.paths = getPaths({
      cwd: this.cwd,
      config: this.userConfig!,
      env: this.env
    });
    logger.debug('paths:');
    logger.debug(this.paths);

    // setup initial presets and plugins
    const baseOpts = {
      pkg: this.pkg,
      cwd: this.cwd
    };
    this.initialPresets = resolvePresets({
      ...baseOpts,
      presets: opts.presets || [],
      userConfigPresets: this.userConfig.presets || []
    });
    this.initialPlugins = resolvePlugins({
      ...baseOpts,
      plugins: opts.plugins || [],
      userConfigPlugins: this.userConfig.plugins || []
    });
    this.babelRegister.setOnlyMap({
      key: 'initialPlugins',
      value: lodash.uniq([
        ...this.initialPresets.map(({ path }) => path),
        ...this.initialPlugins.map(({ path }) => path)
      ])
    });
    logger.debug('initial presets:');
    logger.debug(this.initialPresets);
    logger.debug('initial plugins:');
    logger.debug(this.initialPlugins);
  }

  setStage(stage: ServiceStage) {
    this.stage = stage;
  }

  resolvePackage() {
    try {
      return require(join(this.cwd, 'package.json'));
    } catch (e) {
      return {};
    }
  }

  loadEnv() {
    const basePath = join(this.cwd, '.env');
    const localPath = `${basePath}.local`;
    loadDotEnv(basePath);
    loadDotEnv(localPath);
  }

  getPluginAPI(opts: any) {}

  registerPlugin(plugin: Plugin) {
    // 考虑要不要去掉这里的校验逻辑
    // 理论上不会走到这里，因为在 describe 的时候已经做了冲突校验
    if (this.plugins[plugin.id]) {
      const name = plugin.isPreset ? 'preset' : 'plugin';
      throw new Error(`\
${name} ${plugin.id} is already registered by ${this.plugins[plugin.id].path}, \
${name} from ${plugin.path} register failed.`);
    }
    this.plugins[plugin.id] = plugin;
  }

  initPresetsAndPlugins() {
    this.setStage(ServiceStage.initPresets);
    this._extraPlugins = [];
    while (this.initialPresets.length) {
      this.initPreset(this.initialPresets.shift()!);
    }

    this.setStage(ServiceStage.initPlugins);
    this._extraPlugins.push(...this.initialPlugins);
    while (this._extraPlugins.length) {
      this.initPlugin(this._extraPlugins.shift()!);
    }
  }

  initPreset(preset: Preset) {}

  initPlugin(plugin: Plugin) {
    const { id, key, apply } = plugin;

    const api = this.getPluginAPI({ id, key, service: this });

    // register before apply
    this.registerPlugin(plugin);
    apply()(api);
  }
}
