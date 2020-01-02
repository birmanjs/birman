import getUserConfig from './index';

test('rc file', () => {
  getUserConfig();
  expect(1).toEqual(1);
});
