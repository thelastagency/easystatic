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

/* EJS, Markdown, Front Matter */
import ejs from 'ejs';
import fm from 'front-matter';
import Markdown from 'markdown-it';

/* PostCSS and its plug-ins */
import Postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssVars from 'postcss-custom-properties';
import postcssCalc from 'postcss-calc';
import postcssColor from 'postcss-color-function';
import postcssFilter from 'pleeease-filters';
import postcssRem from 'pixrem';
import postcssPseudoSelectors from 'postcss-pseudoelements';
import postcssSelectorNot from 'postcss-selector-not';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import fs from './fs';

const log = debug('easystatic:compile');
const markdown = new Markdown({
  html: true,           // Enable HTML tags in source
});
const postcss = new Postcss([
  postcssImport,
  postcssVars,
  postcssCalc,
  postcssColor,
  postcssFilter,
  postcssRem,
  postcssPseudoSelectors,
  postcssSelectorNot,
  autoprefixer,
  cssnano,
]);

async function md(file, { baseDir, assetsDir, data }) {
  log(`compile.md('${file}', { baseDir: '${baseDir}', assetsDir: '${assetsDir}' })`);
  const source = await fs.readFile(path.resolve(file), 'utf-8');
  const layoutFile = path.resolve(baseDir, path.join(assetsDir, 'main.ejs'));
  const layout = await fs.readFile(layoutFile, 'utf-8');
  const fmContent = fm(source);
  const content = markdown.render(fmContent.body);
  fmContent.attributes.id = fmContent.attributes.id || '';
  fmContent.attributes.title = fmContent.attributes.title || '';
  fmContent.attributes.description = fmContent.attributes.description || '';
  return ejs.render(layout, { ...data, ...fmContent.attributes, content, filename: layoutFile });
}

async function css(pathname, { baseDir, assetsDir, production }) {
  log(`compile.css('${pathname}', { baseDir: '${baseDir}', ` +
      `assetsDir: '${assetsDir}', production: ${production} })`);
  const filename = path.resolve(baseDir, path.join(assetsDir, pathname));
  const source = await fs.readFile(filename, 'utf-8');
  return await postcss.process(source, {
    from: filename.substr(path.resolve(process.cwd()).length + 1),
    to: pathname,
    map: production === true ? false : { inline: true },
  });
}

export default { md, css };
