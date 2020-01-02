import isUrl from './is-url';

test('url', () => {
  expect(isUrl('http://baidu.com')).toEqual(true);
  expect(isUrl('https://baidu.com')).toEqual(true);
});

test('not url', () => {
  expect(isUrl('./a')).toEqual(false);
  expect(isUrl('/a')).toEqual(false);
});
