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
	// optimization: {
	// 	moduleIds: 'deterministic',
	// 	minimize: true,
	// 	mangleWasmImports: true,
	// 	mangleExports: true,
	// 	sideEffects: true,
	// 	runtimeChunk: {
	// 		name: entrypoint => `runtimechunk~${entrypoint.name}`,
	// 	},
	// 	splitChunks: {
	// 		chunks: 'all',
	// 		minSize: 20000,
	// 		minRemainingSize: 0,
	// 		minChunks: 1,
	// 		maxAsyncRequests: 30,
	// 		maxInitialRequests: 30,
	// 		enforceSizeThreshold: 50000,
	// 		cacheGroups: {
	// 			defaultVendors: {
	// 				reuseExistingChunk: true,
	// 			},
	// 			vendor: {
	// 				test: /[\\/]node_modules[\\/]/,
	// 				priority: -10,
	// 				reuseExistingChunk: true,
	// 			},
	// 			default: {
	// 				minChunks: 2,
	// 				priority: -20,
	// 				reuseExistingChunk: true,
	// 			},
	// 		},
	// 	},
	// 	minimizer: [
	// 		new TerserPlugin({
	// 			extractComments: true,
	// 		}),
	// 		new CssMinimizerPlugin({
	// 			parallel: true,
	// 			minimizerOptions: {
	// 				preset: [
	// 					'default',
	// 					{
	// 						discardComments: { removeAll: true },
	// 					},
	// 				],
	// 			},
	// 		}),
	// 	],
	// },
	plugins: [
		new ImageMinimizerPlugin({
			test: /\.(png|jpe?g|gif)$/,
			severityError: 'warning', // Ignore errors on corrupted images
			deleteOriginalAssets: true,
			// filename: '[path][name].webp',
			minimizerOptions: {
				// plugins: ['imagemin-webp'], 
			},
			loader: false,
		}),
		new MiniCssExtractPlugin({
			// filename: '[name].[contenthash].css',
			filename: 'style.[fullhash].css',
			chunkFilename: '[id].[fullhash].css',
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				stylus: {
					// use: [poststylus([ 'autoprefixer', 'rucksack-css' ])]
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
							publicPath: '/dist',
							// modules: {
              //   namedExport: true,
              // },
						},
          },
          { loader: 'css-loader' },
          // {loader: 'stylus-loader'},
          {
            loader: 'stylus-loader', // compiles Stylus to CSS
            options: {
              use: [autoprefixer()],
            },
          },
        ],
      },
			// {
			// 	test: /\.styl$/,
			// 	use: [MiniCssExtractPlugin.loader, 'style-loader',  'css-loader', 'stylus-loader'],
			// 	exclude: /node_modules/
			// }
			
		],
	},
	optimization: {
		// minimizer: [
		// 	new CssMinimizerPlugin(),
		// ]
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