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
import cp from 'cp-file';
import fs from './fs';
import scaffold from './scaffold';
import compile from './compile';
import info from './info';

const log = debug('easystatic:build');

/**
 * Builds a distributable version of the static site from source files.
 */
async function build({ baseDir, buildDir, assetsDir, base, production }) {
  log(`build({ baseDir: '${baseDir}' })`);
  await scaffold({ baseDir, assetsDir });

  // Clean up the output directory
  log('remove', path.resolve(baseDir, buildDir));
  await fs.removeDir(path.resolve(baseDir, buildDir));

  // Load information about the project from GitHub API and NPM Registry.
  // For example, the number of stars on GitHub, package version on NPM etc.
  const data = await info({ baseDir });

  // https://github.com/isaacs/node-glob#options
  const opts = { cwd: path.resolve(process.cwd(), baseDir) };

  // Get the list of Markdown files in the source folder
  let files = await glob(['**/*.md', `!${buildDir}/**`, `!${assetsDir}/**`], opts);

  // Compile *.md files and copy them to dist/*.html
  await Promise.all(files.map(file => new Promise(async (resolve, reject) => {
    try {
      // Resolve URL path from a filename:
      //   - index.md       -> /
      //   - privacy.md     -> /privacy
      //   - about/index.md -> /about
      //   - about/team.md  -> /about/team
      const pathname = `/${file}`.replace(/(\/index)?\.md$/, '') || '/';
      // Generate HTML markup from a Markdown file
      const contents = await compile.md(path.join(baseDir, file), {
        baseDir,
        assetsDir,
        production,
        data: { ...data, base, path: pathname, file }, // data variables for EJS template(s)
      });
      // Resolve the output filename:
      //   - /index.md       -> /dist/index.html
      //   - /about/index.md -> /dist/about/index.html
      const filename = path.resolve(baseDir, path.join(buildDir, file.replace(/\.md$/, '.html')));
      log('create', filename);
      await fs.createDir(path.dirname(filename));
      await fs.writeFile(filename, contents, 'utf-8');
      resolve();
    } catch (err) {
      reject(err);
    }
  })));

  // Bundle and minimize all the CSS files that a referenced in assets/main.css and
  // save the resulting bundle to dist/main.css
  const css = await compile.css('/main.css', { baseDir, assetsDir, production });
  await fs.writeFile(path.resolve(baseDir, path.join(buildDir, 'main.css')), css, 'utf-8');

  // Copy the remaining assets from the assets folder to dist.
  opts.cwd = path.resolve(opts.cwd, assetsDir);
  files = await glob(['**/*.*', '!**/*.{md,ejs,css}'], opts);
  await Promise.all(files.map(file => cp(
    path.resolve(baseDir, assetsDir, file),
    path.resolve(baseDir, buildDir, file)
  )));
}

export default build;
