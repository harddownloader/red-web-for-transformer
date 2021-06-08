const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		historyApiFallback: true,
		open: true,
		hot: true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ESLintPlugin({
			extensions: ['.js', 'jsx'],
		}),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'style.css' ,
      chunkFilename: '[id].css',
    }),
	],
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
			},
			{
        test: /\.styl$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "stylus-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
		],
	},
})