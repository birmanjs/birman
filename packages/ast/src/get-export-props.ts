import { types, traverse } from '@birman/babel-plugin-utils';
import { parse } from './utils';

export default function getExportProps(code: string) {
  const ast = parse(code);
  let props = {};
  traverse.default(ast as any, {
    Program: {
      enter(path: any) {
        const node = path.node;
        const defaultExport = findExportDefault(node);
        if (!defaultExport || !types.isIdentifier(defaultExport)) return;

        const { name } = defaultExport;
        props = findAssignmentExpressionProps({
          programNode: node,
          name
        });
      }
    }
  });
  return props;
}

function findExportDefault(programNode: types.Program) {
  for (const n of programNode.body) {
    if (types.isExportDefaultDeclaration(n)) {
      return n.declaration;
    }
  }
  return null;
}

function findAssignmentExpressionProps(opts: { programNode: types.Program; name: string }) {
  const props = {};
  for (const n of opts.programNode.body) {
    let node = n;
    if (types.isExpressionStatement(node)) {
      // @ts-ignore
      node = node.expression;
    }
    if (
      types.isAssignmentExpression(node) &&
      types.isMemberExpression(node.left) &&
      types.isIdentifier(node.left.object) &&
      (types.isStringLiteral(node.right) ||
        types.isNumericLiteral(node.right) ||
        types.isBooleanLiteral(node.right))
    ) {
      props[node.left.property.name] = (node.right as types.StringLiteral).value;
    }
  }
  return props;
}
