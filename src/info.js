/**
 * Easystatic - static site generator (https://easystatic.com)
 *
 * Copyright © 2016 Easystatic contributors. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import path from 'path';
import https from 'https';
import debug from 'debug';
import defaults from './defaults.js';

const log = debug('easystatic:info');

https.userAgent = 'Easystatic';

async function tryFetch(options) {
  return new Promise((resolve) => {
    log(`tryFetch(${JSON.stringify(options)})`);
    https.get(options, res => {
      const result = [];
      res.on('data', chunk => result.push(chunk));
      res.on('end', () => {
        const body = result.join('');
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(body);
            resolve(json);
            return;
          } catch (err) {
            log(err);
          }
        }
        log(`Error ${res.statusCode}: ${body}`);
        resolve();
      });
    }).on('error', (err) => {
      log(err);
      resolve();
    });
  });
}

/**
 * If there is a package.json file present in the current working repository,
 * load project's metadata from GitHub API and NPM Registry. Otherwise, return
 * some default values (see defaults.json).
 */
async function info({ baseDir }) {
  log(`info({ baseDir: '${baseDir}' })`);
  let pkg;
  let pkgFilename;

  try {
    pkgFilename = path.resolve(baseDir, '../package.json');
    pkg = require(pkgFilename);
  } catch (err) {
    log(`Failed to read ${pkgFilename}. ${err.message}`);
  }

  if (!pkg) {
    return defaults;
  }

  const tasks = [];

  // Fetch NPM module stats
  if (pkg.name) {
    tasks.push(tryFetch({
      hostname: 'registry.npmjs.com',
      port: 443,
      path: `/${pkg.name}`,
      method: 'GET',
      headers: { 'User-Agent': 'Easystatic' },
    }).then(data => {
      if (data) {
        defaults.npm = data;
      } else {
        console.log(`Failed to load https://registry.npmjs.com/${pkg.name}`);
      }
    }));
  }

  // Fetch GitHub repository stats
  if (pkg.repository) {
    tasks.push(tryFetch({
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${pkg.repository}`,
      method: 'GET',
      headers: { 'User-Agent': 'Easystatic' },
    }).then(data => {
      if (data) {
        defaults.github = data;
      } else {
        console.log(`Failed to load https://api.github.com/repos/${pkg.repository}`);
      }
    }));
  }

  await Promise.all(tasks);

  return defaults;
}

export default info;
