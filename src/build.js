/**
 * Easystatic - static site generator (https://easystatic.com)
 *
 * Copyright © 2016 Easystatic contributors. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import debug from 'debug';
import path from 'path';
import glob from 'globby';
import fs from './fs';
import scaffold from './scaffold';
import compile from './compile';
import info from './info';

const log = debug('easystatic:build');

async function build({ baseDir, buildDir, assetsDir, production }) {
  log(`build({ baseDir: '${baseDir}' })`);
  await scaffold({ baseDir, assetsDir });

  log('remove', path.resolve(baseDir, buildDir));
  await fs.removeDir(path.resolve(baseDir, buildDir));

  const data = await info({ baseDir });

  const files = await glob([`${baseDir}/**/*.md`, `!${buildDir}`, `!${assetsDir}`]);
  await Promise.all(files.map(file => new Promise(async (resolve, reject) => {
    try {
      const contents = await compile.md(file, { baseDir, assetsDir, data });
      const outFile = path.resolve(file)
        .substr(path.resolve(baseDir).length + 1)
        .replace(/\.md$/, '.html');
      const filename = path.resolve(baseDir, path.join(buildDir, outFile));
      log('create', filename);
      await fs.createDir(path.dirname(filename));
      await fs.writeFile(filename, contents, 'utf-8');
      resolve();
    } catch (err) {
      reject(err);
    }
  })));
  const css = await compile.css('/main.css', { baseDir, assetsDir, production });
  await fs.writeFile(path.resolve(baseDir, path.join(buildDir, 'main.css')), css, 'utf-8');
}

export default build;
