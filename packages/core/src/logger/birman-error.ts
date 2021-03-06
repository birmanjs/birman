// @ts-ignore
import errorCodeMap from '@birman/error-code-map';

export const ERROR_CODE_MAP = process.env.ERROR_CODE_MAP_PATH
  ? require(process.env.ERROR_CODE_MAP_PATH)
  : errorCodeMap;

interface Opts {
  message: string;
  code: string;
  context?: object;
}

export default class BirmanError extends Error {
  public code: string;
  public context: object;

  constructor(opts: Opts, ...params: any) {
    const { message, code, context } = opts;
    // @ts-ignore
    super(message, ...params);
    this.code = code;
    this.context = context || {};

    this.test();
  }

  test() {
    if (this.code) {
      return;
    }
    for (const c of Object.keys(ERROR_CODE_MAP)) {
      const { test } = ERROR_CODE_MAP[c];
      if (test && test({ error: this, context: this.context })) {
        this.code = c;
        break;
      }
    }
  }
}
