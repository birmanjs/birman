import { traverse } from '@birman/babel-plugin-utils';
import { parse } from './utils';

export default function isReactComponent(code: string) {
  const ast = parse(code);
  let hasJSXElement = false;
  traverse.default(ast as any, {
    JSXElement() {
      hasJSXElement = true;
    }
  });
  return hasJSXElement;
}
