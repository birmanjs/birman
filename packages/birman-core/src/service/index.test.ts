import { join } from 'path';
import { winPath } from '@birman/utils';
import Service from './';
import { ApplyPluginsType } from './enums';

const fixtures = join(__dirname, 'fixtures');

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
