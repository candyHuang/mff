//vi my-fis-bin/index.js
var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('mff');
fis.cli.name = 'mff';
fis.cli.info = require('./package.json');
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

// 服务类型
fis.set('server.type', 'jello');
fis.set('project.fileType.text', 'handlebars');

// 配置目录规范和部署规范
fis

.hook('commonjs', {
  // 配置项
})

.match('({widget,ui}/**)', {
  isMod: true,
  useHash: true,
  release: '/public/$1'
})


.match('{page,widget}/**.jsp', {
  useHash: false,
  release: '/views/$0'
})

.match('{page,widget}/**.html', {
  useHash: false,
  release: '/public/$0'
})

.match('static/(**)', {
  useHash: true,
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

.match('*.scss', {
  rExt: '.css',
  parser: fis.plugin('node-sass')
})

.match('*.handlebars', {
  release: false,
    rExt: '.handlebars',
    parser: fis.plugin('handlebars-4.x')
})

// global end


// 后端联调时
fis.media('backend')

.match('({widget,ui}/**.{js,css})', {
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
    to: '${devServer}/webapps${devDomain}'
  })
})

// 提交代码前
fis.media('commit')

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

//替换里面的 <fis:widget id="widget/header/header"/>

//fis.match('::package', {
//  postpackager: function(ret, conf, settings, opt) {
//    // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
//      // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
//      // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
//      //         可以修改静态资源列表或者其他
//    
//    
//      fis.util.map(ret.src, function(subpath, file){
//          //有isViews标记才需要做替换
//          if(file.isViews){
//              var content = file.getContent();
//              //替换文件内容
//              content = content.replace(/<fis:widget [^>]*id=['"]([^'"]+)[^>]*>/gi, function (match, id) {
//                var release = ret.ids[id].release
//                 
//                return '<%@ include file="' + release + '"%>'
//            });
//              file.setContent(content);
//          }
//      });
//  }
//});


