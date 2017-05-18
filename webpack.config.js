/**
 * Created by ТерземанЕА on 27.04.2017.
 */
var path = require('path');

module.exports = {
    entry: './client/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};