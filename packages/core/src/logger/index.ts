import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { chalk } from '@birman/utils';
import BirmanError, { ERROR_CODE_MAP } from './birman-error';
import Common from './common';

marked.setOptions({
  renderer: new TerminalRenderer()
});

interface LogErrorOpts {
  detailsOnly?: boolean;
}

export default class Logger extends Common {
  private isBirmanError(error: Error): error is BirmanError {
    return !!(error instanceof BirmanError);
  }

  /**
   *
   * @param e only print BrimanError
   * @param opts
   */
  private printBirmanError(e: BirmanError, opts = {} as LogErrorOpts) {
    const { detailsOnly } = opts;
    const { code } = e;

    if (!code) return;

    const { message, details } = ERROR_CODE_MAP[code];
    console.error(`\n${chalk.bgRed.black('ERROR CODE')} ${chalk.red(code)}`);

    if (!detailsOnly) {
      console.error(`\n${chalk.bgRed.black('ERROR')} ${chalk.red(e.message || message)}`);
    }

    const osLocale = require('os-locale');
    const lang = osLocale.sync();

    if (lang === 'zh-CN') {
      console.error(`\n${chalk.bgMagenta.black(' DETAILS ')}\n\n${marked(details['zh-CN'])}`);
    } else {
      console.error(`\n${chalk.bgMagenta.black(' DETAILS ')}\n\n${marked(details.en)}`);
    }

    if (!detailsOnly && e.stack) {
      console.error(
        `${chalk.bgRed.black(' STACK ')}\n\n${e.stack.split('\n').slice(1).join('\n')}`
      );
    }
  }

  public log(...args: any) {
    // TODO: node env production
    process.stdout.write(chalk.black.bgBlue('LOG') + ' ');
    console.log(...args);
  }

  /**
   * The {@link logger.info} function is an alias for {@link logger.log()}.
   * @param args
   */
  public info(...args: any) {
    this.log(...args);
  }

  public error(...args: any) {
    if (this.isBirmanError(args?.[0])) {
      // @ts-ignore
      this.printBirmanError(...args);
    } else {
      process.stderr.write(chalk.black.bgRed('ERROR') + ' ');
      console.error(...args);
    }
  }

  public warn(...args: any) {
    process.stderr.write(chalk.black.bgHex('#faad14')('WARN') + ' ');
    console.warn(...args);
  }

  public profile(id: string, message?: string) {
    const time = Date.now();
    const namespace = `${this.namespace}:${id}`;
    // for test
    let msg;
    if (this.profilers[id]) {
      const timeEnd = this.profilers[id];
      delete this.profilers[id];
      process.stderr.write(chalk.black.bgCyan('PROFILE') + ' ');
      msg = `${chalk.black.bgCyan('PROFILE')} ${chalk.cyan(
        `└ ${namespace}`
      )} Completed in ${this.formatTiming(time - timeEnd)}`;
      console.log(msg);
    } else {
      msg = `${chalk.black.bgCyan('PROFILE')} ${chalk.cyan(`┌ ${namespace}`)} ${message || ''}`;
      console.log(msg);
    }

    this.profilers[id] = time;
    return msg;
  }
}
