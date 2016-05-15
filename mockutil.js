/**
 * mock ajax
 */

// raplace placeholder
exports.replacePlaceholder = function(content) {
    if (content.indexOf('<!-- __MOCK_PLACEHOLDER__ -->') !== -1) {
        var stringify = '';
      
        stringify += '<script src="test/mock.js"></script>\n';
        stringify += '<script src="test/ajax-conf.js"></script>';
        content = content.replace(/<!-- __MOCK_PLACEHOLDER__ -->/, stringify);
    }
    return content;
}

// ajax 模拟script
exports.replaceAjaxMockScript = function(content) {
    var str = ';!function(){var mockConf = ';

    str += content
    str += 'for (var prop in mockConf) {'
    str += 'Mock.mock(RegExp("^" + prop.trim() + "(\\\\?.*)?$"), mockConf[prop])'
    str += '}'
    str += '}();'

    return str
}