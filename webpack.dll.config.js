const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: {
    vendor: [
      'qiankun',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'prop-types',
      'mobx',
      'mobx-react',
      'echarts',
      'lodash',
      'moment',
      'antd',
      'lingmou-basic-library',
      "lingmou-components"
    ],
  },
  resolve: {
    alias: {},
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    library: '[name]_library',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 6,
            warnings: false,

            comparisons: false,

            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 6,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: true,
      }),
    ],
    splitChunks: {
      chunks: 'async',
      name: false,
    },
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_library',
      path: path.resolve('./dist', '[name]-manifest.json'), //描述生成的manifest文件
    }),
  ],
};
