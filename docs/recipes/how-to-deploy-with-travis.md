---
id: how-to-deploy-with-travis
title: How to deploy a static site to GitHub Pages with Travis CI | Easystatic
---
## How to deploy a static site to GitHub Pages with Travis

This step-by-step tutorial will help you to setup an automated deployment of your static website to
**GitHub Pages** (free CDN hosting) by using [Travis CI](https://travis-ci.org/).

### Step 1: Create `.travis.yml` file

In the root of your project's source tree create a file named `.travis.yml` that may look something
like this:

```yml
sudo: false
language: node_js
node_js:
  - "5"
install:
  - npm install -g easystatic
script:
  - es deploy [<path>] --repo=<repo> --domain=<domain>
```

Where `<path>` is the name of the folder with `*.md` files, `<repo>` is a GitHub Pages repository,
and `<domain>` is a custom domain name of your site. For example:

```bash
es deploy docs --repo=easystatic/easystatic.github.io --domain=easystatic.com
```

### Step 2: Create GitHub access token

Go to *GitHub.com* ˃ *Account* ˃ *Settings* ˃ *Personal access tokens*, and generate a new token
that is going to be used for automated deployments as described [here](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).
When you create this token, you should specify either `repo` or `public_repo` permission for it.

### Step 2: Add your static site repo to Travis CI

You can log in to [Travis CI](https://travis-ci.org) via your GitHub account. Go to
[https://travis-ci.org/profile](https://travis-ci.org/profile), click `[Sync account]` button to
make sure that Travis has a fresh list of your repositories, find repository with the source files
of your static site and enable continuous integration for it. Then navigate to that repo in Travis,
go to *Settings* and add the following environment variables:

```
GITHUB_USER = Travis CI
GITHUB_EMAIL = <your-email-address>
GITHUB_TOKEN = <your-github-token>
```

...

That's it! Now when edit source files of your static site and push them to GitHub, Travis should
automatically deploy your site to [GitHub Pages](https://help.github.com/articles/creating-project-pages-manually/).
