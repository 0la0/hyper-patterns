const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const { version } = packageJson;

const webpackConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.js',
  },
  output: {
    publicPath: 'dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'pspattern.js',
    sourceMapFilename: 'pspattern.js.map',
    library: 'ps-pattern',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$|\.html$|\.worker.js$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      }
    ]
  },
  devServer: {
    port: 3001
  },
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version),
    }),
  ]
};

module.exports = webpackConfig;
