import endWithSlash from './end-with-slash';

test('normal', () => {
  expect(endWithSlash('./a')).toEqual('./a/');
  expect(endWithSlash('./a/')).toEqual('./a/');
});
