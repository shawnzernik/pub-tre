const path = require('path');

module.exports = {
    entry: {
        login: './src/pages/login.tsx',
        copyright: './src/pages/copyright.tsx',
        users: './src/pages/users.tsx',
        user: './src/pages/user.tsx',
        group: './src/pages/group.tsx',
        groups: './src/pages/groups.tsx',
    },
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // Split common dependencies from node_modules
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    chunks: 'all',
                },
                // Split common code from your src folder (components, services, etc.)
                src: {
                    test: /[\\/]src[\\/](components|services)[\\/]/, // Target components/services directories
                    name: 'common',
                    chunks: 'all',
                    enforce: true, // Force this split even for smaller chunks
                },
            },
        },
    },
};