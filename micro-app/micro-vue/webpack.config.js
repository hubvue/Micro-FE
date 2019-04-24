const {resolve} = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const VueLoaderPluign = require("vue-loader/lib/plugin");
const WebpackSystemRegister = require("webpack-system-register");
module.exports = {
    entry: {
        "vue-app": "./src/App.vue",
    },
    output: {
        path: resolve("./dist"),
        filename: "[name]-[chunkhash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: "vue-loader",
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPluign(),
        new WebpackSystemRegister({})
    ]
}