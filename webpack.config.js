const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const TerserJSPlugin = require('terser-webpack-plugin') // min js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // min css

const autoprefixer = require('autoprefixer-stylus')

const devMode = process.env.NODE_ENV !== 'production'
// console.log(devMode)
// dev - devMode = true
// prod - devMode = false

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]

  if (devMode) {
    loaders.push('eslint-loader')
  }

  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['@babel/polyfill', './index.js'],
  mode: 'development', // uncompress
  output: {
    filename: 'bundle.[hash].js', // 'build.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})], // new UglifyJsPlugin()
  },
  resolve: {
    // элиасы
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      fonts: path.join(__dirname, 'src/assets/fonts'),
    },
  },
  devtool: devMode ? 'source-map' : false,
  devServer: {
    port: 5000,
    hot: devMode,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // template: 'index.html',
      template: path.resolve(__dirname, 'src/index.pug'),
      // template: 'index.ejs', это для проставления места инжекта - https://github.com/jantimon/html-webpack-plugin#options
      // inject: 'body',

      /* minify: { это не нужно так как юзается альтернатива
        removeComments: devMode ? false : true,
        collapseWhitespace: devMode ? false : true
      }*/
    }),
    new CopyPlugin({
      patterns: [
        {
          // imgs
          from: path.resolve(__dirname, 'src/assets/img'),
          to: 'assets/img',
        },
        {
          // html
          from: path.resolve(__dirname, 'src/assets/html'),
          to: 'assets/html',
        },
        {
          // fonts
          from: path.resolve(__dirname, 'src/assets/fonts'),
          to: 'assets/fonts',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? 'style.css' : 'style.[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
            },
          },
          'css-loader?url=false',
          // 'postcss-loader',
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
            options: { publicPath: '/dist' },
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
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.(png|svg|jpg|gif|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        // include: path.join(__dirname, ''),
        options: {
          publicPath: './',
          limit: 10000,
        },
      },
    ],
  },
}
