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
        users: "./src/pages/users.tsx",
        user: "./src/pages/user.tsx",
        group: "./src/pages/group.tsx",
        groups: "./src/pages/groups.tsx",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/copyright.html",
            chunks: ["common", "copyright"],
            title: "Copyright & License"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/login.html",
            chunks: ["common", "login"],
            title: "Login"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/users.html",
            chunks: ["common", "users"],
            title: "Users List"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/user.html",
            chunks: ["common", "user"],
            title: "User Edit"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/groups.html",
            chunks: ["common", "groups"],
            title: "Groups List"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "../static/pages/group.html",
            chunks: ["common", "group"],
            title: "Group Edit"
        })
    ]
};