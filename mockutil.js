var mockPath = 'test/ajax-conf.js';

exports.mock = function(fis, src, idsMap) {
        // 数据mock
        var mockConf = null,
            stringify = '',
            content,
            prop;

        if (fis.util.isFile(mockPath)) {
            mockConf = fis.util.readJSON(mockPath)
        }
        fis.util.map(src, function(subpath, file) {
            if (mockConf && file.rExt === '.jsp') {
                content = file.getContent();

                if (content.indexOf('<!-- __MOCK_PLACEHOLDER__ -->') !== -1) {
                	var mockEntry = idsMap['test/mock-main.js']
                	var mockLib = idsMap['test/mock.js']
                	
                    stringify += '<script src="' + mockLib.map.uri + '"></script>\n';
                    stringify += '<script src="' + mockEntry.map.uri + '"></script>';
                    content = content.replace(/<!-- __MOCK_PLACEHOLDER__ -->/, stringify);
                    file.setContent(content);
                }
            }
        });
    }
    // ajax 模拟script
exports.replaceAjaxMockScript = function(fis, content) {
    if (fis.util.isFile(mockPath)) {
    	var rs = '';
        mockConf = fis.util.readJSON(mockPath);
        for (prop in mockConf) {
            rs += 'Mock.mock("' + prop + '",' + JSON.stringify(mockConf[prop], null, 2) + ');';
        }
        content = content.replace(/\b__MOCK_ENTRY__\b/, rs);
    }
    return content
}
