import assert from 'assert';
import * as utils from '@birman/utils';
import Logger from '../logger';
import Service from './';
import { isValidPlugin, pathToObj } from './utils/plugin-utils';
import { EnableBy, PluginType, ServiceStage } from './enums';
import { Command, Hook, Plugin, PluginConfig, Preset } from './types';
import Html from '../html';

interface Opts {
  id: string;
  key: string;
  service: Service;
}

export default class PluginAPI {
  id: string;
  key: string;
  service: Service;
  Html: typeof Html;
  utils: typeof utils;
  logger: Logger;

  constructor(opts: Opts) {
    this.id = opts.id;
    this.key = opts.key;
    this.service = opts.service;
    this.utils = utils;
    this.Html = Html;
    this.logger = new Logger(`birman:plugin:${this.id || this.key}`);
  }

  register(hook: Hook) {
    assert(
      hook.key && typeof hook.key === 'string',
      `api.register() failed, hook.key must supplied and should be string, but got ${hook.key}.`
    );
    assert(
      hook.fn && typeof hook.fn === 'function',
      `api.register() failed, hook.fn must supplied and should be function, but got ${hook.fn}.`
    );
    this.service.hooksByPluginId[this.id] = (this.service.hooksByPluginId[this.id] || []).concat(
      hook
    );
  }

  registerCommand(command: Command) {
    const { name, alias } = command;
    assert(
      !this.service.commands[name],
      `api.registerCommand() failed, the command ${name} is exists.`
    );
    this.service.commands[name] = command;
    if (alias) {
      this.service.commands[alias] = name;
    }
  }
}
