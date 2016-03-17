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
import Repo from 'git-repository';
import build from './build';
import fs from './fs';

const log = debug('easystatic:deploy');

async function deploy({ baseDir, buildDir, assetsDir, repo, domain }) {
  log(`deploy({
  baseDir: '${baseDir}',
  buildDir: '${buildDir}',
  assetsDir: '${assetsDir}',
  repo: '${repo}',
  domain: '${domain}'
})`);
  await build({ baseDir, buildDir, assetsDir });

  if (domain) {
    const cnameFile = path.resolve(baseDir, path.join(buildDir, './CNAME'));
    log('create', cnameFile);
    await fs.writeFile(cnameFile, domain, 'utf-8');
  }

  log(`git push to https://github.com/${repo}.git`);
  const git = await Repo.open(path.resolve(baseDir, buildDir), { init: true });
  git.setRemote('origin', `https://${process.env.GH_TOKEN ? `${process.env.GH_TOKEN}@` : ''}github.com/${repo}.git`);
  await git.add('--all .');
  await git.commit('Initial commit');
  await git.push('origin', repo.endsWith('.io') ? 'master' : 'gh-pages', { force: true });

  log('remove', path.resolve(baseDir, buildDir));
  await fs.removeDir(path.resolve(baseDir, buildDir));
}

export default deploy;
