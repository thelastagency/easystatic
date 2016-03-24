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
  await build({ baseDir, buildDir, assetsDir, production: true });

  if (domain) {
    const cnameFile = path.resolve(baseDir, path.join(buildDir, './CNAME'));
    log('create', cnameFile);
    await fs.writeFile(cnameFile, domain, 'utf-8');
  }

  log(`git push to https://github.com/${repo}.git`);
  const git = await Repo.open(path.resolve(baseDir, buildDir), { init: true });

  if (process.env.GITHUB_USER) {
    log(`git config user.name ${process.env.GITHUB_USER}`);
    await git.config('user.name', process.env.GITHUB_USER);
  }

  if (process.env.GITHUB_EMAIL) {
    log(`git config user.email ${process.env.GITHUB_EMAIL}`);
    await git.config('user.email', process.env.GITHUB_EMAIL);
  }

  if (process.env.GITHUB_TOKEN) {
    const credentialsFilename = path.resolve(process.env.HOME, '.git-credentials');
    log(`Save GITHUB_TOKEN to ${credentialsFilename}`);
    await fs.writeFile(credentialsFilename, `https://${process.env.GITHUB_TOKEN}:@github.com/${repo}.git`);
    await git.config('credential.username', process.env.GITHUB_TOKEN);
    await git.config('credential.helper', 'store');
  }

  git.setRemote('origin', `https://github.com/${repo}.git`);
  await git.add('--all .');
  await git.commit('Initial commit');

  try {
    await git.push('origin', repo.endsWith('.io') ? 'master' : 'master:gh-pages', { force: true });
  } catch (err) {
    throw new Error(
      `Failed to push the contents of the ${path.resolve(baseDir, buildDir)} ` +
      `folder to https://github.com/${repo}.git`
    );
  }

  log('remove', path.resolve(baseDir, buildDir));
  await fs.removeDir(path.resolve(baseDir, buildDir));
}

export default deploy;
