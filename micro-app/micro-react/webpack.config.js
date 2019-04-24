const {resolve} = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WebpackSystemRegister = require("webpack-system-register");
module.exports = {
    entry: {
        "react-app": "./src/App.jsx",
    },
    output: {
        path: resolve("./dist"),
        filename: "[name]-[chunkhash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: resolve("./node_modules")
            }
        ]
    },
    resolve:{
        extensions:['.js','.jsx']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackSystemRegister({
            systemjsDeps: [
                /^react/, // any import that starts with react
                'react-dom', // only the `react-dom` import
                /^lodash/, // any import that starts with lodash
            ],
        }),
    ]
}