const path = require("path");
const webpack = require("webpack");
//const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');

const devMode = process.env.NODE_ENV !== 'development'

module.exports = {
  entry: {
    app: "./src/index.jsx"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    //publicPath: "/dist/"
  },
  optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false,
				extractComments: 'all',
				uglifyOptions: {
					compress: true,
					output: null
				}
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					safe: true,
					discardComments: {
						removeAll: true,
					},
				},
			})
		]
  },
  plugins: [
		new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /jsx$/),
		new webpack.LoaderOptionsPlugin({
			options: {
				debug: false
			}
		}),
		/*
		new GoogleFontsPlugin({
			fonts: [
					{ family: "Lobster Two" },
					{ family: "Raleway" },
					{ family: "Roboto", variants: [ "400", "700italic" ] }
			],
			name: "fonts",
			filename: "fonts.css",
		}),
		*/
		new MiniCssExtractPlugin({
			//filename: "[name].css",
			filename: "style.css",
			chunkFilename: "[id].css"
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			Popper: ['popper.js', 'default']
		}),
		new CompressionPlugin({
			test: /\.(js|css)/
		}),
		new UglifyJsPlugin(),
		new WebpackShellPlugin({
			onBuildStart: ['echo "Webpack Start"'],
      //onBuildEnd: ['postcss --dir wwwroot/dist wwwroot/dist/*.css','echo "Webpack End"']
      onBuildEnd: ['echo "Webpack End"']
		})
	],
  module: {
    rules: [
      {
				test: /\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						//options: {
						//	minimize: true,
						//	sourceMap: true
						//}
					},
					{
						loader: "sass-loader"
					}
				]
			},
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?name=[name].[ext]&outputPath=images/&publicPath=https://nice2b.me/wp-content/themes/primitiveone/dist/images",
          "image-webpack-loader"
        ]
      },
      {
        test: /\.(woff2?|svg)$/,
        loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
      },
      {
        test: /\.(ttf|eot)$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
		modules: [
      path.resolve('./dist/app'),
      //path.resolve('./dist/js/App'),
			//path.resolve('./React/js/App/Modules/Client'),
			//path.resolve('./React/js/App/Modules/Admin'),
			path.resolve('./node_modules')
		]
	},
  watch: false
};