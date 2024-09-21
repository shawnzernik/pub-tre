const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: "inline-source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "scripts"),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "common",
                    chunks: "all",
                },
                src: {
                    test: /[\\/]src[\\/](components|services)[\\/]/,
                    name: "common",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    entry: {
        login: "./src/pages/login.tsx",
        copyright: "./src/pages/copyright.tsx",
        account: "./src/pages/account.tsx",
        help: "./src/pages/help.tsx",
        lists: "./src/pages/lists.tsx",
        list: "./src/pages/list.tsx"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/login.html",
            chunks: ["common", "login"],
            title: "Login"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/copyright.html",
            chunks: ["common", "copyright"],
            title: "Copyright & License"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/account.html",
            chunks: ["common", "account"],
            title: "My Account"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/help.html",
            chunks: ["common", "help"],
            title: "Help"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/lists.html",
            chunks: ["common", "lists"],
            title: "List View"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/list.html",
            chunks: ["common", "list"],
            title: "List Edit"
        })
    ]
};