const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.js',
  },
  output: {
    publicPath: 'dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'hyperpatterns.js',
    sourceMapFilename: 'hyperpatterns.js.map',
    library: 'hyperpatterns',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$|\.html$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      }
    ]
  },
  devServer: {
    port: 3001,
    contentBase: path.join(__dirname, 'src'),
  }
};
