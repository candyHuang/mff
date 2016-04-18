module.exports = function(){
    var content = [
        '',
        '              ________',
        '   ____ ___  / __/ __/',
        '  / __ `__ \/ /_/ /_  ',
        ' / / / / / / __/ __/  ',
        '/_/ /_/ /_/_/ /_/     ',
        '',
        '       v' + fis.cli.info.version,
        ''
    ].join('\n');
    console.log(content);
};
