/**
 * Easystatic - static site generator (https://easystatic.com)
 *
 * Copyright © 2016 Easystatic contributors. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

function readFile(path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function writeFile(path, contents, options) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, contents, options, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createDir(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function removeDir(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default { stat, readFile, writeFile, createDir, removeDir };
