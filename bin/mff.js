#!/usr/bin/env node

// vi my-fis-bin/bin/mff.js

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var info = require('../package.json');
var cli = new Liftoff({
  name: info.name, // 命令名字
  processTitle: info.name,
  moduleName: info.name,
  configName: 'fis-conf',

  // only js supported!
  extensions: {
    '.js': null
  }
});


cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, function(env) {
  var fis;
  if (!env.modulePath) {
    fis = require('../');
  } else {
    fis = require(env.modulePath);
  }
  fis.set('system.localNPMFolder', path.join(env.cwd, info.name));
  fis.set('system.globalNPMFolder', path.dirname(__dirname));
  fis.cli.run(argv, env);
});