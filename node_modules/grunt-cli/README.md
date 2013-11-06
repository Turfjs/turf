# grunt-cli [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-cli.png?branch=master)](http://travis-ci.org/gruntjs/grunt-cli)
> The Grunt command line interface.

Install this globally and you'll have access to the `grunt` command anywhere on your system.

```shell
npm install -g grunt-cli
```

**Note:** The job of the `grunt` command is to load and run the version of Grunt you have installed locally to your project, irrespective of its version.  Starting with Grunt v0.4, you should never install Grunt itself globally.  For more information about why, [please read this](http://blog.nodejs.org/2011/03/23/npm-1-0-global-vs-local-installation).

See the [Getting Started](http://gruntjs.com/getting-started) guide for more information.

## Shell tab auto-completion
To enable bash tab auto-completion for Grunt, add the following line to your `~/.bashrc` file. Currently, the only supported shell is bash.

```bash
eval "$(grunt --completion=bash)"
```

## Installing grunt-cli locally
If you don't have administrator rights, you may need to install grunt-cli locally to your project using `npm install grunt-cli --save-dev`.  Unfortunately, this will not put the `grunt` executable in your PATH.  You'll need to specify its explicit location when executing it, eg: `./node_modules/.bin/grunt`,

Note: Using grunt-cli in this way is unsupported.
