#!/usr/bin/env node
const { program } = require('commander');
const publish = require('./modules/publish');
const utils = require('./utils');

program.version(utils.getConfig());
publish(program)

program.parse(process.argv);