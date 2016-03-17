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
import fm from 'front-matter';
import Markdown from 'markdown-it';
import ejs from 'ejs';
import Postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from './fs';

const log = debug('easystatic:compile');
const markdown = new Markdown();
const postcss = new Postcss([autoprefixer, cssnano]);

async function md(file, { baseDir, assetsDir }) {
  log(`compile.md('${file}', { baseDir: '${baseDir}', assetsDir: '${assetsDir}' })`);
  const source = await fs.readFile(path.resolve(file), 'utf-8');
  const layoutFile = path.resolve(baseDir, path.join(assetsDir, 'layout.ejs'));
  const layout = await fs.readFile(layoutFile, 'utf-8');
  const fmContent = fm(source);
  const body = markdown.render(fmContent.body);
  return ejs.render(layout, { ...fmContent.attributes, content: body });
}

async function css(pathname, { baseDir, assetsDir }) {
  log(`compile.css('${pathname}', { baseDir: '${baseDir}', assetsDir: '${assetsDir}' })`);
  const filename = path.join(assetsDir, pathname);
  const source = await fs.readFile(path.resolve(baseDir, filename), 'utf-8');
  return await postcss.process(source, {
    from: filename,
    to: pathname,
    map: { inline: true },
  });
}

export default { md, css };
