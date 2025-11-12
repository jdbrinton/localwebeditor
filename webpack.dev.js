const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true
  },
  devtool: 'source-map',
  cache: { type: 'filesystem' },
  resolve: { extensions: ['.ts', '.js', '.mjs'] },
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
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', favicon: './src/assets/favicon.ico' }),
    new MonacoEditorWebpackPlugin({
      languages: ['typescript', 'javascript', 'json', 'css', 'html', 'markdown']
    }),
    new ForkTsCheckerWebpackPlugin()
  ],
  devServer: {
    static: false,
    hot: true,
    port: 9000,
    open: false,
    client: { overlay: true },
    devMiddleware: { writeToDisk: false },
    watchFiles: { paths: ['src/**/*'], options: { usePolling: true, interval: 200, ignored: /node_modules/ } }
  },
  stats: 'minimal'
};
