//vi my-fis-bin/index.js
var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('mff');
fis.cli.name = 'mff';
fis.cli.info = require('./package.json');

var Mock = require('mockjs');
var LocalDeliver = require('./local-deliver.js')
var Mockutil = require('./mockutil.js');

// 重置命令列表
fis.set('modules.commands', ['init', 'release', 'server']);
// 重置help信息
fis.cli.help = (function(oldHelp) {
return function(cmdName, options, commands) {
  if (!cmdName) {
    commands = {};
    fis.media().get('modules.commands', []).forEach(function(name) {
      var cmd = fis.require('command', name);
      name = cmd.name || name;
      name = fis.util.pad(name, 12);
      commands[name] = cmd.desc || '';
    });

    options =  {
      '-h, --help': 'print this help message',
      '-v, --version': 'print product version and exit'
    };
    cmdName = '<command>';
  }
  oldHelp(cmdName, options, commands)
}
}(fis.cli.help))
// 重置版本信息
fis.cli.version = require('./version.js');

// 忽略项目
var ignoreArr = fis.get('project.ignore');
ignoreArr = ignoreArr.concat(['.svn/**', '.DS_Store', '.gitignore', '.jshintrc'])
fis.set('project.ignore', ignoreArr);

// 服务类型
fis.set('server.type', 'jello');
fis.set('project.fileType.text', 'handlebars');

// 配置目录规范和部署规范
fis

.hook('commonjs', {
  // 配置项(这个暂时插件未实现)
  ignoreDependencies: [
    'static/lib/**',
    'test/**'
  ]
})  

.match('{page,widget,ui}/**', {
  isMod: true,
  useHash: true,
  release: '/public/$0'
})

.match('page/**.js', {
  isMod: false
})


.match('widget/**.jsp', {
  useMap: false,
  useHash: false,
  release: '/views/$0'
})

.match('page/(**.jsp)', {
  useMap: false,
  useHash: false,
  useCache: false,
  release: '/views/$1',
  preprocessor: function(content, file, settings) {
    // 数据模拟替换
    if (fis.project.currentMedia() === 'dev') {
      content = Mockutil.replacePlaceholder(content)
    }
    return content
  }
})

.match('{page,widget}/**.html', {
  useHash: false,
  release: '/public/$0'
})

.match('static/(**)', {
  useHash: true,
  isMod: false,
  release: '/public/$1'
})

.match('*.{eot,svg,ttf,woff,woff2}', {
  useHash: false
})

.match('*.min.{js,css}', {
  optimizer: null
})

.match('package.json', {
  release: false
})

.match('_*.{scss,css,js}', {
  release: false
})

// .match('*.scss', {
//   rExt: '.css',
//   parser: fis.plugin('node-sass')
// })

.match('*.handlebars', {
  rExt: '.js',
  isMod: false,
  release: false,
  parser: fis.plugin('handlebars-4.x')
})

.match('test/**.json', {
  useCache: false,
  preprocessor: function(content, file, settings) {
    return JSON.stringify(Mock.mock(JSON.parse(content)));
  }
})

.match('test/ajax-conf.js', {
  useCache: false,
  useHash: true,
  preprocessor: function(content, file, settings) {
    return Mockutil.replaceAjaxMockScript(content)
  }
})

// 避免 commomjs 扫描非模块依赖
.match('{static/lib/,test/}/**.js', {
  ignoreDependencies: true
})

.match('::package', {
  postpackager: function (ret, conf, settings, opt) {
    // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
    // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
    // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，

    var idsMap = ret.ids;

    fis.util.map(ret.map.res, function(id, info){
      var file = idsMap[id];
      if(file && file.ignoreDependencies && info.deps){
        delete info.deps
      }
    })
  }
})

// global end


// 后端联调时
fis.media('backend')

.match('({page,widget,ui}/**.{js,css})', {
  url: '${devDomain}/public/$1'
})

.match('static/(**)', {
  url: '${devDomain}/public/$1'
})

.match('{WEB-INF/**,test/**}', {
  release: false
})

.match('*', {
  deploy: function(options, modified, total, next) {
    var server = fis.config.get('devServer')
    var domain = fis.config.get('devDomain')

    options.to = server + '/webapps' + domain
    LocalDeliver(options, modified, total, next)
  }
})

// 提交代码前
fis.media('commit')

.match('({page,widget,ui}/**.{js,css})', {
  url: '${devDomain}/public/$1'
})

.match('static/(**)', {
  url: '${devDomain}/public/$1'
})

.match('{WEB-INF/**,test/**}', {
  release: false
})
.match('*', {
  deploy: fis.plugin('local-deliver', {
    to: "../"
  })
})

// .match('**.js', {
//     optimizer: fis.plugin('uglify-js')
// })

// .match('**.css', {
//     optimizer: fis.plugin('clean-css')
// })
// 
// fis.match('*.png', {
  // optimizer: fis.plugin('png-compressor')
// });
