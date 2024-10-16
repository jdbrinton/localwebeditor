const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'docs'),
        publicPath: '/',
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
            languages: [
                'abap', 'apex', 'azcli', 'bat', 'bicep', 'c', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 
                'cypher', 'dart', 'dockerfile', 'ecl', 'elixir', 'flow', 'fsharp', 'go', 'graphql', 'handlebars', 'hcl', 'html', 
                'ini', 'java', 'javascript', 'julia', 'kotlin', 'less', 'lexon', 'lua', 'm3', 'markdown', 'mips', 'msdax', 
                'mysql', 'objective-c', 'pascal', 'perl', 'pgsql', 'php', 'pla', 'plaintext', 'postiats', 'powerquery', 
                'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 
                'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sparql', 'sql', 'st', 'swift', 'systemverilog', 'tcl', 'twig', 
                'typescript', 'vb', 'xml', 'yaml'
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets/CNAME', to: '.' },
                { from: 'src/assets/.nojekyll', to: '.' },
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
