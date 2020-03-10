import { NodePath, Visitor } from '@babel/traverse';
import { extname } from 'path';
import { t } from '@birman/utils';

export interface Opts {
  flag?: string;
}

const CSS_EXTNAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

export default function() {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<t.ImportDeclaration>, { opts }: { opts: Opts }) {
        const {
          specifiers,
          source,
          source: { value }
        } = path.node;
        if (specifiers.length && CSS_EXTNAMES.includes(extname(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`;
        }
      }
    } as Visitor
  };
}
