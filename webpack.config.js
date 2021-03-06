const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const Terser = require('terser-webpack-plugin');
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin');


const isDev = process.env.NODE_ENV  === 'development'
const isProd = !isDev
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssets(),
            new Terser()
        ]
    }
    return config;
}

const babelOptions = (preset) => {
    const opts = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
        cacheCompression: false
      }
    if (preset) {
        opts.presets.push(preset)
    }
    return opts;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './main.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(),
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: isDev,
        historyApiFallback: true
      },
    resolve:{
        plugins: [
            new DirectoryNamedWebpackPlugin()
        ],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@c': path.resolve(__dirname, 'src/components'),
            '@p': path.resolve(__dirname, 'src/pages'),
            '@s': path.resolve(__dirname, 'src/store')
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
                keepClosingSlash: true,
                removeComments: isProd,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
              }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
        
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}