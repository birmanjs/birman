import { _ } from '@walrus/shared-utils';

export function makeArray(item) {
  if (_.isArray(item)) return item;
  return [item];
}
