/**
 * Easystatic - static site generator (https://easystatic.com)
 *
 * Copyright © 2016 Easystatic contributors. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import { parse as parseUrl } from 'url';
import scaffold from './scaffold';
import compile from './compile';
import info from './info';

function start({ baseDir, assetsDir }) {
  scaffold({ baseDir, assetsDir }).then(() => info({ baseDir})).then((data) => {
    const bs = require('browser-sync').create();

    bs.init({
      server: {
        baseDir,
        async middleware(req, res, next) {
          const url = parseUrl(req.url);
          const pathname = url.pathname === '/' ? '/index' : url.pathname;

          if (pathname.match(/\.css$/)) {
            try {
              const result = await compile.css(pathname, { baseDir, assetsDir });
              res.setHeader('Content-Type', 'text/css');
              res.end(result.css, 'utf-8');
            } catch (err) {
              next(err);
            }
          } else if (req.headers.accept.split(',').some(x => x === 'text/html')) {
            try {
              const filename = path.join(baseDir, `${pathname}.md`);
              const contents = await compile.md(filename, { baseDir, assetsDir, data });
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(contents, 'utf-8');
            } catch (err) {
              next(err);
            }
          } else {
            next();
          }
        },
      },
      files: [{
        match: path.resolve(baseDir, path.join(assetsDir, '**/*.css')),
        fn(event, file) {
          this.reload('main.css');
        }
      }],
      plugins: [
        {
          module: 'bs-html-injector',
          options: {
            files: [
              path.resolve(baseDir, '**/*.md'),
              path.resolve(baseDir, '**/*.ejs'),
            ],
          },
        },
      ],
    });
  }).catch(err => console.error);
}

export default start;
