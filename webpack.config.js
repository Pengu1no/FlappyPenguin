const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    watch: true,
    entry: {
        index: [
            './src/index.ts',
            './src/style.scss',
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: [
                    // MiniCssExtractPlugin.loader,
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-modules-typescript-loader',
                    },
                    {
                        loader: '@teamsupercell/typings-for-css-modules-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDevelopment,
                            modules: {
                                compileType: 'icss',
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment,
                        },
                    },

                ],
            },
            {
                test: /\.tsx?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|svg|gif|woff(2)?|ttf|eot)$/,
                loader: "file-loader",
                options: {
                    sourceMap: isDevelopment,
                }
            },
        ],
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './dist',
        watchContentBase: true,
        host: '0.0.0.0',
        open: true,
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/assets/',
                    to: './assets/',
                },
                {
                    from: './src/favicon.ico',
                    to: './favicon.ico',
                },
            ],
        }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            gifsicle: {
                interlaced: true,
            },
            jpegtran: {
                progressive: true,
            },
            optipng: {
                optimizationLevel: 5,
            },
            svgo: {
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ],
            },
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
        }),
        new CleanWebpackPlugin(),
    ],
};
