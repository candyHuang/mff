var Mock = require('mockjs');
var mockPath = 'test/ajax-conf.js';

exports.mock = function(fis, src) {
	// 数据mock
	var mockConf = null,
		content,
		stringify,
		prop;

	if (fis.util.isFile(mockPath)) {
	  mockConf = fis.util.readJSON(mockPath)
	}
	fis.util.map(src, function(subpath, file){
	  if (mockConf && file.rExt === '.jsp') {
	    content = file.getContent();
	    stringify = '<fis:require id="test/mock.js" />\n';
	    stringify += '<fis:script>';

	    for(prop in mockConf) {
	      stringify += 'Mock.mock("' + prop + '",' + JSON.stringify(mockConf[prop]) + ');';
	    }
	    stringify += '</fis:script>';

	    content = content.replace(/<!-- __MOCK_PLACEHOLDER__ -->/, stringify);
	    file.setContent(content);
	  }

	  if (file.isTestJson) {
	    content = file.getContent();

	    file.setContent(JSON.stringify(Mock.mock(JSON.parse(content))))
	  }
	});
}