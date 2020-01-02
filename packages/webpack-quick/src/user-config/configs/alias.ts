import assert from 'assert';
import { isPlainObject } from 'lodash';

export default {
  name: 'alias',
  validate(val: any) {
    assert(isPlainObject(val), `The alias config must be plain object, but got ${val}`);
  }
};
