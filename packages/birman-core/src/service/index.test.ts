import { join } from 'path';
import { winPath } from '@birman/utils';
import Service from './';
import { ApplyPluginsType } from './enums';

const fixtures = join(__dirname, 'fixtures');

const simplyPluginIds = ({ cwd, plugins }: { cwd: string; plugins: any }) =>
  Object.keys(plugins).map((id) => {
    const type = plugins[id].isPreset ? 'preset' : 'plugin';
    return `[${type}] ${id.replace(winPath(cwd), '.')}`;
  });

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    presets: [require.resolve(join(cwd, 'preset_1')), require.resolve(join(cwd, 'preset_2'))],
    plugins: [require.resolve(join(cwd, 'plugin_1')), require.resolve(join(cwd, 'plugin_2'))]
  });
  expect(service.pkg.name).toEqual('foo');
  expect(service.initialPresets.map((p) => p.key)).toEqual([
    'index',
    'index',
    '2',
    '2',
    'bigfish',
    '1',
    '1'
  ]);
  expect(service.initialPlugins.map((p) => p.key)).toEqual([
    'plugin1',
    'plugin2',
    '2',
    '2',
    '1',
    '1'
  ]);

  await service.init();
  const plugins = simplyPluginIds({
    cwd: cwd,
    plugins: service.plugins
  });
  expect(plugins).toEqual([
    '[preset] ./preset_1/index',
    '[preset] ./preset_1/preset_1/index',
    '[preset] ./preset_2/index',
    '[preset] @birman/preset-2',
    '[preset] birman-preset-2',
    '[preset] @alipay/birman-preset-bigfish',
    '[preset] @birman/preset-1',
    '[preset] birman-preset-1',
    '[plugin] ./preset_1/preset_1/plugin_1',
    '[plugin] ./preset_1/plugin_1',
    '[plugin] ./preset_1/plugin_2',
    '[plugin] ./preset_2/plugin_1',
    '[plugin] ./plugin_1',
    '[plugin] ./plugin_2',
    '[plugin] @birman/plugin-2',
    '[plugin] birman-plugin-2',
    '[plugin] @birman/plugin-1',
    '[plugin] birman-plugin-1'
  ]);

  expect(service.hooks['foo'].length).toEqual(2);

  const ret = await service.applyPlugins({
    key: 'foo',
    type: ApplyPluginsType.add
  });
  expect(ret).toEqual(['a', 'a']);
});

test('api.args', async () => {
  const cwd = join(fixtures, 'api-args');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))]
  });
  const ret = await service.run({
    name: 'build',
    args: {
      projectName: 'bar'
    }
  });
  expect(ret).toEqual(`hello bar`);
});

test('api.registerCommand', async () => {
  const cwd = join(fixtures, 'api-registerCommand');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))]
  });
  const ret = await service.run({
    name: 'build',
    args: {
      projectName: 'bar'
    }
  });
  expect(ret).toEqual(`hello bar`);
});

test('api.registerCommand aliased', async () => {
  const cwd = join(fixtures, 'api-registerCommand-aliased');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))]
  });
  const ret = await service.run({
    name: 'b',
    args: {
      projectName: 'bar'
    }
  });
  expect(ret).toEqual(`hello bar`);
});

test('api.registerMethod', async () => {
  const cwd = join(fixtures, 'api-registerMethod');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin_1')), require.resolve(join(cwd, 'plugin_2'))]
  });
  await service.init();
  const api = service.getPluginAPI({
    service,
    id: 'test',
    key: 'test'
  });
  // @ts-ignore
  expect(api.foo()).toEqual('foo');
  // @ts-ignore
  expect(api.bar()).toEqual('bar');
});

test('api.registerMethod fail if exist', async () => {
  const cwd = join(fixtures, 'api-registerMethod');
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(join(cwd, 'plugin_1')),
      require.resolve(join(cwd, 'plugin_1_duplicated'))
    ]
  });
  await expect(service.init()).rejects.toThrow(
    /api\.registerMethod\(\) failed, method foo is already exist/
  );
});

test('api.registerMethod return silently if exist and opts.exitsError is set to false', async () => {
  const cwd = join(fixtures, 'api-registerMethod');
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(join(cwd, 'plugin_1')),
      require.resolve(join(cwd, 'plugin_1_duplicated_existsError_false'))
    ]
  });
  await service.init();
});

test('api.registerMethod should have the right plugin id', async () => {
  const cwd = join(fixtures, 'api-registerMethod');
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(join(cwd, 'plugin_3')),
      require.resolve(join(cwd, 'plugin_3_api_foo'))
    ]
  });
  await service.init();
  expect(Object.keys(service.hooksByPluginId)[0]).toContain('./plugin_3_api_foo');
});

// --------- registerPlugin ---------

test('registerPlugin id conflict', async () => {
  const cwd = join(fixtures, 'registerPlugin-conflict');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin_1')), require.resolve(join(cwd, 'plugin_2'))]
  });
  await expect(service.init()).rejects.toThrow(/plugin foo is already registered by/);
});

test('registerPlugin id conflict (preset)', async () => {
  const cwd = join(fixtures, 'registerPlugin-conflict');
  const service = new Service({
    cwd,
    presets: [require.resolve(join(cwd, 'preset_1')), require.resolve(join(cwd, 'preset_2'))]
  });
  await expect(service.init()).rejects.toThrow(/preset foo is already registered by/);
});

test.skip('skip plugins', async () => {
  const cwd = join(fixtures, 'skip-plugins');
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(join(cwd, 'plugin_1')),
      require.resolve(join(cwd, 'plugin_2')),
      require.resolve(join(cwd, 'plugin_3')),
      require.resolve(join(cwd, 'plugin_4'))
    ]
  });
  await service.init();
  expect(Object.keys(service.hooksByPluginId)).toEqual(['plugin_4']);
});
