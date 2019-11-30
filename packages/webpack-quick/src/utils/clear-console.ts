import { isWindows } from '@walrus/shared-utils';

/**
 * 清空控制台
 */
export default function() {
  const { CLEAR_CONSOLE = 'none' } = process.env;

  if (CLEAR_CONSOLE !== 'none') {
    process.stdout.write(isWindows ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  }
}
