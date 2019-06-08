const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const rootPath = './';

module.exports = [
  {
    context: __dirname,
    entry: {
      app: rootPath + 'index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),

      // Needed by  for multiline strings
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
    resolve: {
      alias: {}
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                // Minify css
                minimize: true
              }
            }
          ]
        },
        {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
          use: ['url-loader']
        },
        {
          // Remove pragmas
          test: /\.js$/,
          enforce: 'pre',
          // include: path.resolve(__dirname, Source),
          use: [
            {
              loader: 'strip-pragma-loader',
              options: {
                pragmas: {
                  debug: false
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: rootPath + 'index.html'
      }),
      // Copy  Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin([
        { from: 'libs', to: 'libs' },
        { from: 'images', to: 'images' },
        { from: 'styles', to: 'styles' }
      ]),
      new webpack.DefinePlugin({
        // Define relative base path in  for loading assets
        _BASE_URL: JSON.stringify('')
      }),
      // Uglify js files
      new UglifyJsPlugin(),
      // Split  into a seperate bundle
      new webpack.optimize.CommonsChunkPlugin({
        name: 'giscafer',
        minChunks: function (module) {
          return module.context && module.context.indexOf('giscafer') !== -1;
        }
      })
    ]
  }
];
