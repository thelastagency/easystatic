/**
 * Easystatic - static site generator (https://easystatic.com)
 *
 * Copyright © 2016 Easystatic contributors. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import debug from 'debug';
import globby from 'globby';
import cp from 'cp-file';
import fs from './fs';

const log = debug('easystatic:init');

async function createIndexFile(baseDir) {
  const filename = path.resolve(baseDir, 'index.md');
  try {
    if ((await fs.stat(filename)).isFile()) {
      return;
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  log(`Create ${filename} file`);
  await await cp(path.join(__dirname, '../template/index.md'), filename);
}

async function scaffold({ baseDir, assetsDir }) {
  log(`scaffold({ baseDir: '${baseDir}', assetsDir: '${assetsDir}' })`);

  await createIndexFile(baseDir);

  const assetsPath = path.resolve(baseDir, assetsDir);

  try {
    if ((await fs.stat(assetsPath)).isDirectory()) {
      log(`Skip scaffolding because ${assetsPath} folder already exists.`);
      return;
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  const files = await globby(path.join(__dirname, '../template/**/*.*'));
  for (const file of files) {
    if (file.endsWith('index.md')) {
      continue;
    }

    const dest = path.resolve(assetsPath, file.substr(path.join(__dirname, '../template').length + 1));
    log(`Copy ${file} to ${dest}`);
    await cp(file, dest);
  }
}

export default scaffold;
