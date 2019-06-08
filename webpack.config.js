const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootPath = './';

module.exports = [
  {
    context: __dirname,
    entry: {
      app: rootPath + 'app.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),

      // Needed  for multiline strings
      sourcePrefix: ''
    },
    amd: {
      // Enable webpack-friendly use of require in
      toUrlUndefined: true
    },
    node: {
      // Resolve node module use of fs
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json|gltf)$/,
          use: ['url-loader']
        },
        {
          test: /\.js$/,
          loader: 'babel-loader?presets=es2015'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: rootPath + 'index.html'
      }),
      // Copy Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin([
        { from: 'libs', to: 'libs' },
        { from: 'images', to: 'images' }
      ]),
      new webpack.DefinePlugin({
        // Define relative base path in  for loading assets
        _BASE_URL: JSON.stringify('')
      }),
      // Split  into a seperate bundle
      new webpack.optimize.CommonsChunkPlugin({
        name: 'giscafer',
        minChunks: function(module) {
          return module.context && module.context.indexOf('giscafer') !== -1;
        }
      })
    ],

    // development server options
    devServer: {
      contentBase: path.join(__dirname, 'dist')
    }
  }
];
