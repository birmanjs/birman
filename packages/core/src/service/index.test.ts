import { join } from 'path';
import { winPath } from '@birman/utils';
import Service from '.';
import { ApplyPluginsType } from './enums';

const fixtures = join(__dirname, 'fixtures');

const simplyPluginIds = ({ cwd, plugins }: { cwd: string; plugins: any }) =>
  Object.keys(plugins).map((id) => {
    const type = plugins[id].isPreset ? 'preset' : 'plugin';
    return `[${type}] ${id.replace(winPath(cwd), '.')}`;
  });

test('no package.json', () => {
  const service = new Service({
    cwd: join(fixtures, 'no-package-json')
  });
  expect(service.pkg).toEqual({});
});

test('applyPlugin with add', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'add'))]
  });
  await service.init();
  const ret = await service.applyPlugins({
    key: 'test',
    type: ApplyPluginsType.add
  });
  expect(ret).toEqual(['a', 'b', 'c', 'd']);
});

test('applyPlugin with add failed with non-array initialValue', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'add'))]
  });
  await service.init();
  await expect(
    service.applyPlugins({
      key: 'test',
      type: ApplyPluginsType.add,
      initialValue: ''
    })
  ).rejects.toThrow(/opts\.initialValue must be Array if opts\.type is add/);
});

test('applyPlugin with modify', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'modify'))]
  });
  await service.init();
  const ret = await service.applyPlugins({
    key: 'test',
    type: ApplyPluginsType.modify,
    initialValue: []
  });
  expect(ret).toEqual(['a', 'b', 'c', 'd']);
});

test('applyPlugin with event', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'event'))]
  });
  await service.init();
  let count = 0;
  const ret = await service.applyPlugins({
    key: 'test',
    type: ApplyPluginsType.event,
    args: {
      increase(step: number) {
        count += step;
      }
    }
  });
  expect(count).toEqual(3);
});

test('applyPlugin with unsupported type', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd
  });
  await service.init();
  await expect(
    service.applyPlugins({
      key: 'test',
      type: 'unsupport-event' as ApplyPluginsType
    })
  ).rejects.toThrow(/type is not defined or is not matched, got/);
});

test('applyPlugin with stage', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'stage'))]
  });
  await service.init();
  const ret = await service.applyPlugins({
    key: 'test',
    type: ApplyPluginsType.add
  });
  expect(ret).toEqual(['c', 'a', 'd', 'e', 'b']);
});

test('applyPlugin with stage and registerMethod', async () => {
  const cwd = join(fixtures, 'applyPlugins');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'stage_registerMethod'))]
  });
  await service.init();
  const ret = await service.applyPlugins({
    key: 'foo',
    type: ApplyPluginsType.add
  });
  expect(ret).toEqual(['c', 'a', 'd', 'e', 'b']);
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

test('api.registerPresets', async () => {
  const cwd = join(fixtures, 'api-registerPresets');
  const service = new Service({
    cwd,
    presets: [require.resolve(join(cwd, 'preset_1'))]
  });
  await service.init();
  const plugins = simplyPluginIds({
    cwd: cwd,
    plugins: service.plugins
  });
  expect(plugins).toEqual(['[preset] ./preset_1', '[preset] preset_2', '[preset] ./preset_3']);
});

test('api.registerPlugins', async () => {
  const cwd = join(fixtures, 'api-registerPlugins');
  const service = new Service({
    cwd,
    presets: [require.resolve(join(cwd, 'preset_1'))],
    plugins: [require.resolve(join(cwd, 'plugin_1'))]
  });
  await service.init();
  const plugins = simplyPluginIds({
    cwd: cwd,
    plugins: service.plugins
  });
  expect(plugins).toEqual([
    '[preset] ./preset_1',
    '[plugin] plugin_4',
    '[plugin] ./plugin_5',
    '[plugin] ./plugin_1',
    '[plugin] plugin_2',
    '[plugin] ./plugin_3'
  ]);
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

test('plugin register throw error', async () => {
  const cwd = join(fixtures, 'plugin-register-throw-error');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))]
  });
  await expect(service.init()).rejects.toThrow(/foo/);
});

test('plugin syntax error', async () => {
  const cwd = join(fixtures, 'plugin-syntax-error');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))]
  });
  await expect(service.init()).rejects.toThrow(/Register plugin .+? failed/);
});

test('enableBy', async () => {
  const cwd = join(fixtures, 'enableBy');
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(join(cwd, 'appType')),
      require.resolve(join(cwd, 'foo')),
      require.resolve(join(cwd, 'bar_enableByConfig')),
      require.resolve(join(cwd, 'hoo_enableByFunction'))
    ]
  });
  await service.init();

  const c1 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  });
  expect(c1).toEqual(['foo']);

  // 加上配置开启
  service.userConfig = {
    bar: {}
  };
  const c2 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  });
  expect(c2).toEqual(['foo', 'bar']);

  // 再加上自定义开启
  service.config = {
    appType: 'console'
  };
  const c3 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  });
  expect(c3).toEqual(['foo', 'bar', 'hoo']);
});
