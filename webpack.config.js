const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'docs'),
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/assets/favicon.ico',
        }),
        new MonacoEditorWebpackPlugin({
            languages: ['javascript', 'typescript', 'python', 'css', 'html'],
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/assets/cname', to: 'docs' },
            ],
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, 'docs'),
        port: 9000,
        open: false,
    },
    devtool: 'source-map',
    mode: 'development',
};
