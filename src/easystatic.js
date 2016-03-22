/**
 * Easystatic - static site generator (https://easystatic.com)
 *
 * Copyright © 2016 Easystatic contributors. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import start from './start';
import build from './build';
import deploy from './deploy';
import { version } from '../package.json';

const argv = require('minimist')(process.argv.slice(2));
const [command, baseDir] = argv._;

const options = {
  baseDir: baseDir || './',
  buildDir: argv.dist || 'dist',
  assetsDir: argv.assets || 'assets',
};

const help = console.log.bind(this, `  Usage: es <command> [<path>] [options]

  A simple static website generator

  Command:

    start          Open the site in a browser
    build          Build the site into the 'dist' folder
    deploy         Publish website to GitHub pages

  Options:

    -h, --help     Output usage information
    -v, --version  Output the version number

  Examples:

    $ es start docs
    $ es deploy docs --repo=easystatic/easystatic.github.io --domain=easystatic.com
  `);

if (argv.help || argv.h) {
  help();
} else if (argv.version || argv.v) {
  console.log(version);
} else if (command === 'start') {
  start(options);
} else if (command === 'build') {
  build(options).catch(console.error);
} else if (command === 'deploy') {
  deploy({
    ...options,
    production: true,
    repo: argv.repo || argv.r,
    domain: argv.domain || argv.d,
  }).catch(console.error);
} else {
  help();
}
