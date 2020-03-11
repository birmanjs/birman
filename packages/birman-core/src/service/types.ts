import joi from '@hapi/joi';
import { yargs } from '@birman/utils';
import { EnableBy } from './enums';

export interface Dep {
  [name: string]: string;
}

export interface PluginConfig {
  // 为配置的默认值，用户没有配置时取这个
  default?: any;
  // 用于声明配置的类型
  schema?: {
    (joi: joi.Root): joi.Schema;
  };
  // 是 dev 阶段配置被修改后的处理机制，默认会重启 dev 进程，也可以修改为 api.ConfigChangeType.regenerateTmpFiles 只重新生成临时文件，还可以通过函数的格式自定义
  onChange?: string | Function;
}

export interface Package {
  name?: string;
  dependencies?: Dep;
  devDependencies?: Dep;
  [key: string]: any;
}

export interface Plugin {
  id: string;
  /**
   * 插件的配置 key，通常是包名的简写。
   * @example
   *  @birman/plugin-dva，其 key 为 dva；比如 birman-plugin-antd，其 key 为 antd。
   */
  key: string;
  path: string;
  apply: Function;

  config?: PluginConfig;
  isPreset?: boolean;
  enableBy?: EnableBy | Function;
}

export interface Preset extends Plugin {}

export interface Hook {
  // 标识
  key: string;
  // 具体的实现
  fn: Function;
  pluginId?: string;
  // 调整执行顺序
  before?: string;
  // 调整执行顺序，默认是 0，设为 -1 或更少会提前执行，设为 1 或更多会后置执行
  stage?: number;
}

export interface Command {
  // 命令名称
  name: string;
  // 命令的别名
  alias?: string;
  // 命名的描述
  description?: string;
  details?: string;
  /**
   * 参数为 { args }，
   * args 的格式同 yargs 的解析结果，需要注意的是 _ 里的 command 本身被去掉了
   * @example
   *  birman generate page foo，args._ 为 ['page', 'foo']
   */
  fn: {
    ({ args }: { args: yargs.Arguments }): void;
  };
}
