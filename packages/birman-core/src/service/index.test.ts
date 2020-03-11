import { join } from 'path';
import { winPath } from '@birman/utils';
import Service from './';
import { ApplyPluginsType } from './enums';

const fixtures = join(__dirname, 'fixtures');

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
