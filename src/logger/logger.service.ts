import { Injectable, LoggerService as Logger } from '@nestjs/common';
import chalk from 'chalk';

@Injectable()
export class LoggerService implements Logger {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(chalk.green('--------------------log--------------------'));
    console.log(chalk.green(message), [...optionalParams]);
    // console.log(message, [...optionalParams]);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(chalk.red('--------------------error--------------------'));
    console.log(chalk.red(message), [...optionalParams]);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(chalk.yellow('--------------------warn--------------------'));
    console.log(chalk.yellow(message), [...optionalParams]);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.log(chalk.white('--------------------debug--------------------'));
    console.log(chalk.white(message), [...optionalParams]);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(chalk.blue('--------------------verbose--------------------'));
    console.log(chalk.blue(message), [...optionalParams]);
  }
}
