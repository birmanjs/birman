import isReactComponent from './is-react-component';

test('jsx', () => {
  expect(isReactComponent(`alert(1);`)).toEqual(false);
});

test('no jsx', () => {
  expect(isReactComponent(`export default () => <p />`)).toEqual(true);
});
