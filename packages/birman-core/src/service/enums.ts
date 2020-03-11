export enum PluginType {
  preset = 'preset',
  plugin = 'plugin'
}

export enum EnableBy {
  register = 'register',
  config = 'config'
}

export enum ServiceStage {
  uninitiialized,
  constructor,
  init,
  initPresets,
  initPlugins,
  initHooks,
  pluginReady,
  getConfig,
  getPaths,
  run
}
