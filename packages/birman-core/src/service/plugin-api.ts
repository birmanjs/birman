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

  registerMethod({
    name,
    fn,
    exitsError = true
  }: {
    name: string;
    fn?: Function;
    exitsError?: boolean;
  }) {
    if (this.service.pluginMethods[name]) {
      if (exitsError) {
        throw new Error(`api.registerMethod() failed, method ${name} is already exist.`);
      } else {
        return;
      }
    }
    this.service.pluginMethods[name] =
      fn ||
      // 这里不能用 arrow function，this 需指向执行此方法的 PluginAPI
      // 否则 pluginId 会不会，导致不能正确 skip plugin
      function(fn: Function) {
        const hook = {
          key: name,
          ...(utils.lodash.isPlainObject(fn) ? fn : { fn })
        };
        // @ts-ignore
        this.register(hook);
      };
  }
}
