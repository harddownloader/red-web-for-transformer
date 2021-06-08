const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const autoprefixer = require('autoprefixer-stylus')
var poststylus = require('poststylus'),
		webpack = require('webpack');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new ImageMinimizerPlugin({
			test: /\.(jpe?g\|png\|gif\|tif\|webp\|svg\|avif)\$/i,
			severityError: 'warning', // Ignore errors on corrupted images
			deleteOriginalAssets: true,
			minimizerOptions: {
			},
			loader: false,
		}),
		new MiniCssExtractPlugin({
			filename: 'style.[fullhash].css',
			chunkFilename: '[id].[fullhash].css',
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				stylus: {
					use: [poststylus(['autoprefixer', 'postcss-short', 'postcss-sorting', 'postcss-preset-env', 'rucksack-css'])]
				}
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
        test: /\.styl$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
							esModule: false,
							// publicPath: '/dist',
							// modules: {
              //   namedExport: true,
              // },
						},
          },
          { loader: 'css-loader' },
          {
            loader: 'stylus-loader', // compiles Stylus to CSS
            options: {
              use: [autoprefixer()],
            },
          },
        ],
      },		
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: true,
			}),
			new CssMinimizerPlugin({
				parallel: true,
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: { removeAll: true },
						},
					],
				},
			}),
		],
	}
})