const path = require('path');
const lib = path.resolve("lib");
const webpack = require("webpack");
const projectName = path.basename(__dirname);
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('src/dist/style/css/[name].bundle.css');
const extractLESS = new ExtractTextPlugin('src/dist/style/css/[name].bundle.css');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = (env) => {
    return {
        context: __dirname + "/js"//F:\ss设置上下文相对路径,入口起点（entry）会相对于此目录查找
        //,devtool: '#source-map'
        , entry: {
            test: [
                "babel-polyfill",
                './test'
            ]
        }
        , output: {
            path: path.resolve(__dirname, "js"),
            filename: "[name].bundle.js",
            chunkFilename: '[name].js?[chunkhash:8]'
            /*
             怎么快速又准确的理解 publicPath，我觉得可以用下面的这个公式来表述：
             静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
             举例说明：
             output.publicPath = '/static/'
             // 图片 url-loader 配置
             {
             name: 'img/[name].[ext]'
             }
             // 那么图片最终的访问路径为
             output.publicPath + 'img/[name].[ext]' = '/static/img/[name].[ext]'
             {
             filename: 'js/[name].js'
             }
             那么JS最终访问路径为
             output.publicPath + 'js/[name].js' = '/static/js/[name].js'
             publicPath是相对于当前页面
             */
            , publicPath: "/" + path.basename(__dirname) + "/src/dist"  //path.basename(__dirname) > ss
            //,chunkFilename: "[name].min.js"
        }
        , externals: {
            jquery: "jQuery"
        }
        , devServer: {
            //使用行命令
            inline: true,
            //开启热替换
            hot: true,
            port: 7000,
            publicPath: "/" + path.basename(__dirname) + "/src/dist",
            //当设置为true时，访问所有服务器上不存在的文件，都会被重定向到/，也就是index.html文件
            historyApiFallback: true,
            //就是说开发的时候,我们的html页面从哪个目录提供
            contentBase: "./src/dist"//path.resolve(__dirname)
            /*npm run start(package配置文件中)*/
        }
        , module: {
            rules: [
                {
                    test: /\.css$/,
                    use: extractCSS.extract(['css-loader'])
                },
                {
                    test: /\.less$/i,
                    use: extractLESS.extract(['css-loader', 'less-loader'])
                },
                {//自定义样式模板
                    test: /\.cs$/,
                    use: ['string-loader']
                },
                {
                    test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: "image/[name].[hash:8].[ext]"
                        }
                    }]
                }
                , {test: /\.json$/, use: "json-loader"}
                //,{test: /\.(html|htm|tpl)$/, use:"html-withimg-loader"}
                , {test: /\.(html|htm|tpl)$/, use: "string-loader"}
                , {
                    test: /\.js$/,
                    exclude: /node_modules/
                    , use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [['es2015', {module: false}]]
                            }
                        },
                        {loader: 'eslint-loader'}
                    ]
                }
                , {
                    test: /\.jsx$/,
                    exclude: /node_modules/
                    , use: [
                        {loader: 'react-hot!babel'},
                        {loader: 'eslint-loader'}
                    ]
                }
                /*, {
                 /!* 用来解析vue后缀的文件 *!/
                 test: /\.vue$/,
                 loader: 'vue-loader'
                 }*/
            ]
        }
        , resolve: {
            alias: {
                jquery: path.resolve(__dirname, "src", "lib", "jquery-2.0.3.min"),
                moment: path.resolve(__dirname, "src", "lib", "moment"),
                tools: path.resolve(__dirname, "src", "lib", "Tools")
            }
            , extensions: [".js", ".vue", ".json", ".jsx", ".css", ".less", "scss"]
        }
        , plugins: [
            //new OpenBrowserPlugin({url: 'http://localhost:7000'}),
            new webpack.HotModuleReplacementPlugin(),//热加载插件
            new webpack.NoErrorsPlugin(),
            //用webpack压缩代码,可以忽略代码中的警告
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
                , sourceMap: false
                , except: ['$super', '$', 'exports', 'require']//排除关键字
            }),
            new webpack.DefinePlugin({
                'process.env': env
            }),
            extractCSS,
            extractLESS
        ]
    }
}