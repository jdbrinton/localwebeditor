const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/',
    clean: true
  },
  devtool: 'source-map',
  cache: { type: 'filesystem' },
  resolve: { extensions: ['.tsx', '.ts', '.js', '.mjs'] },
  module: {
    rules: [
      { test: /\.html$/i, loader: 'html-loader' },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: { loader: 'esbuild-loader', options: { loader: 'ts', target: 'es2020' } }
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource' },
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' }
    ]
  },
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [new EsbuildPlugin({ target: 'es2020', css: true })]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', favicon: './src/assets/favicon.ico' }),
    new MonacoEditorWebpackPlugin({
      languages: [
        'typescript','javascript','json','css','html','markdown','python','cpp','c','java','go','rust','sql'
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/CNAME', to: '.' },
        { from: 'src/assets/.nojekyll', to: '.' },
        { from: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', to: 'pdf.worker.min.js' }
      ]
    })
  ],
  performance: { hints: false },
  stats: 'minimal'
};
