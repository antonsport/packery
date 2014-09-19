var path = require('path');
var webpack = require('webpack');

var config = {
  entry: './js/packery.js',

  output: {
    path: __dirname + '/dist',
    filename: 'packery.commonjs.js',
    library: 'Packery',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    root: [path.join(__dirname, 'bower_components')]
  },

  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    )
  ]
};

module.exports = config;
