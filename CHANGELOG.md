# Easystatic Change Log

All notable changes to this project will be documented in this file.

### [Unreleased][unreleased]

- Compile `main.js` file with [Babel](https://babeljs.io) and [Browserify](http://browserify.org/) (PLANNED)

### [v0.1.9] - 2016-03-24

- Add `base` data variables to be used in EJS template(s). For example, when you run
  `es deploy docs --repo=user/project`, the `base` variable will be set to `/project`

### [v0.1.8] - 2016-03-24

- Fix deployment script not being able to push `dist` folder to `gh-pages` branch

### [v0.1.7] - 2016-03-24

- Add `core-js` polyfill to avoid potential compatibility issues with different Node.js versions 

### [v0.1.6] - 2016-03-24

- Add `path` and `file` data variables to be used in EJS template(s). For example, for a URL like
  [easystatic.com/recipes](https://easystatic.com/recipes), the `path` variable will be set to
  `/recipes`, and `file` will be set to `recipes/index.md`.
- Add support of arbitrary static files from the `assets` folder (images, icons etc.)
- Fix index files being not correctly resolved

### [v0.1.5] - 2016-03-24

- Integrate popular, well supported plug-ins for PostCSS:
  [postcss-import](https://www.npmjs.com/package/postcss-import),
  [postcss-custom-properties](https://www.npmjs.com/package/postcss-custom-properties),
  [postcss-calc](https://www.npmjs.com/package/postcss-calc),
  [postcss-color-function](https://www.npmjs.com/package/postcss-color-function),
  [pleeease-filters](https://www.npmjs.com/package/pleeease-filters),
  [pixrem](https://www.npmjs.com/package/pixrem),
  [postcss-pseudoelements](https://www.npmjs.com/package/postcss-pseudoelements),
  [postcss-selector-not](https://www.npmjs.com/package/postcss-selector-not),
  [autoprefixer](https://www.npmjs.com/package/autoprefixer),
  [cssnano](https://www.npmjs.com/package/cssnano)
- Show a notification if a new version of Easystatic is available on NPM

### [v0.1.4] - 2016-03-23

- Fix Browsersync middleware in `start.js` to correctly serve index files

### [v0.1.3] - 2016-03-23

- Add support of `GITHUB_USER`, `GITHUB_EMAIL`, `GITHUB_TOKEN` environment variables that may help
  with automated deployments

### [v0.1.2] - 2016-03-23

- Fix `defaults.json` not being found
- Fix ESLint warnings in source code

### [v0.1.1] - 2016-03-22

- Add `github` and `npm` data variables that can be used inside the templates. For example: `<%= npm.name %>`

### [v0.1.0] - 2016-03-19

- Change the name of the main template from `assets/layout.ejs` to `assets/main.ejs` (BREAKING CHANGE)
- Remove source maps from the generated `main.css` file in production mode
- Add scaffolding and a default template (see `template`)
- Add [CHANGELOG.md](CHANGELOG.md) file with notable changes to this project
- Add [CONTRIBUTING.md](CONTRIBUTING.md) file with instructions on how to contribute to this project

[unreleased]: https://github.com/easystatic/easystatic/compare/v0.1.9...HEAD
[v0.1.9]: https://github.com/easystatic/easystatic/compare/v0.1.8...v0.1.9
[v0.1.8]: https://github.com/easystatic/easystatic/compare/v0.1.7...v0.1.8
[v0.1.7]: https://github.com/easystatic/easystatic/compare/v0.1.6...v0.1.7
[v0.1.6]: https://github.com/easystatic/easystatic/compare/v0.1.5...v0.1.6
[v0.1.5]: https://github.com/easystatic/easystatic/compare/v0.1.4...v0.1.5
[v0.1.4]: https://github.com/easystatic/easystatic/compare/v0.1.3...v0.1.4
[v0.1.3]: https://github.com/easystatic/easystatic/compare/v0.1.2...v0.1.3
[v0.1.2]: https://github.com/easystatic/easystatic/compare/v0.1.1...v0.1.2
[v0.1.1]: https://github.com/easystatic/easystatic/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/easystatic/easystatic/compare/v0.0.8...v0.1.0
