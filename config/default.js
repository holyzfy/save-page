var path = require('path');

var output = path.join(__dirname, '../dist');
module.exports = {
    executablePath: '', // chrome可执行文件的绝对路径
    port: 9182,
    output,
};
