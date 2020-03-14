import getExportProps from './get-export-props';

test('normal', () => {
  const props = getExportProps(
    `
const foo = () => {};
foo.a = 1;
foo.b = '2';
foo.c = function() {};

// TODO: support object and array
foo.d = {};
foo.e = [];

foo.f = true;
foo.g = false;
export default foo;
    `
  );
  expect(props).toEqual({
    a: 1,
    b: '2',
    f: true,
    g: false
  });
});
