const webpack = require("webpack"),
    path = require("path"),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),    
    HardSourceWebpackPlugin = require("hard-source-webpack-plugin"),
    bundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
    
const ROOT_DIR = path.resolve("./"),
    SOURCE_DIR = path.resolve("./src"),
    BUILD_DIR = path.resolve("./build"),
    HTML_TEMPLATE = path.resolve("./src/assets/html/index.html");



module.exports = {
    context : ROOT_DIR,
    output  : {
        path : BUILD_DIR,
        filename : "[name]-bundle.js"
    },
    entry : {
        "vendors" : ["backbone", "underscore", "jquery"],
        "app" : "app"
    },
    resolve : {
        modules : ["./libs", SOURCE_DIR, "node_modules"],
        extensions : [".js", ".json", ".jsx"],
        alias : {
            "backbone" : "backbone/backbone",
            "underscore" : "underscore/underscore",
            "jquery" : "jquery/jquery"
        }
    },
    resolveLoader : {
        alias : {
            text : "raw-loader"
        }
    },    
    devtool : "inline-source-map",
    devServer : {
        inline : true,
        hot : true,
        port : 3000,
        compress : true,
        watchOptions : {
            ignored : /node_modules/
        }
    },
    stats : {
        "chunks" : false,
        "colors" : true
    },
    module : {
        rules : [
            // eslint
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        loader: require.resolve('eslint-loader'),
                        options: {
                            failOnError: true,
                            baseConfig : require.resolve('eslint-config-google'),
                            useEslintrc : true
                        },
                    },
                ],
                include: SOURCE_DIR
            },
            // css 
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                require('autoprefixer')({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                })
                            ],
                        },
                    }
                ],
                include: SOURCE_DIR
            },
            // babel + react
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: require.resolve('babel-loader'),
                    options: {
                        cacheDirectory: true
                    }
                },
                include: SOURCE_DIR
            }
            // another shimming modules (if any)

        ]
    },
    plugins : [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title : `Image Search`,
            author : "smulyono",
            filename : `index.html`,
            appRootDir  : `${SOURCE_DIR}`,
            chunks : ["vendors", "app"],
            template : HTML_TEMPLATE
        }),    
        new CopyWebpackPlugin([{
            from : "./src/assets/css",
            to : "src/assets/css"
        }]),  
        new webpack.ProvidePlugin({
            Backbone : "backbone",
            _ : "underscore"
        }),        
        new HardSourceWebpackPlugin({
            cacheDirectory : "cache/hard-source/[confighash]"
        }),
        ((process.env.NODE_ENV && process.env.NODE_ENV === "production") ?
        new bundleAnalyzer({
            analyzerMode : "static",
            defaultSizes: 'gzip',
            generateStatsFile: true,
            statsFilename : "build-tools/stats.json",
            reportFilename : "build-tools/reports.html",
            openAnalyzer: false,
            logLevel : "silent"
        }) 
        : 
        new bundleAnalyzer({
            analyzerMode : "server",
            analyzerHost : "localhost",
            analyzerPort : 8888,
            defaultSizes: 'gzip',
            generateStatsFile: true,
            statsFilename : "build-tools/stats.json",
            openAnalyzer: false,
            logLevel : "silent"
        }) 
        )
    ]
}