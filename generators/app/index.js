'use strict';
var generators = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    if(!this.fs.exists(this.destinationPath('package.json'))) {
      console.error(chalk.bold.red('No "package.json" found, run "npm init" before!'));
      process.exit(1);
    }
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      name: this.pkg.name,
      description: this.pkg.description
    };
  },

  prompting: function () {
    if (!this.props.description) {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'description',
        message: 'Project description:'
      }, function (answers) {
        this.props.description = answers.description;
        done();
      }.bind(this));
    }
  },

  writing: function () {
    this.template('**/*', './', this.props);
  },

  install: function () {
    this.composeWith('ping:page', {
      options: {
        name: 'home',
        link: '/',
        prefix: 'pg'
      }
    });

    this.composeWith('', {}, {
      local: require.resolve('../dependencies')
    });

    this.composeWith('', {
      options: {
        name: this.props.name,
        description: this.props.description
      }
    }, {
      local: require.resolve('../configurations')
    });

    this.composeWith('', {
      options: {
        name: this.props.name,
        description: this.props.description
      }
    }, {
      local: require.resolve('../readme')
    });
  }
});