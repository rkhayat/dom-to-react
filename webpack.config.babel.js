const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const devtool = isProd ? 'hidden-source-map' : 'source-map';

const entry = isProd ? './src/dom-to-react/index.js' : './src/main.js';

const output = {
  path: path.join(__dirname, 'dist'),
  filename: 'dom-to-react.js',
};

if (isProd) {
  output.libraryTarget = 'umd';
  output.library = 'dom-to-react';
}

const externals = isProd ? {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
  },
} : null;


const loaders = [];

const babelLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets: ['es2015', 'react'],
    plugins: ['transform-class-properties', 'transform-object-rest-spread'],
  },
};
loaders.push(babelLoader);

if (!isProd) {
  const jsonLoader = {
    test: /\.json$/,
    loader: 'json',
  };
  loaders.push(jsonLoader);
}

const resolve = {
  extensions: ['', '.js', '.jsx'],
  modules: [
    path.resolve(__dirname, 'src'),
    'node_modules',
  ],
};

const plugins = [];

if (!isProd) {

  const htmlWebpackPlugin = new HTMLWebpackPlugin({
    title: 'dom-to-react Demo',
    template: 'src/assets/index.ejs',
  });
  plugins.push(htmlWebpackPlugin);
}

const definePlugin = new webpack.DefinePlugin({
  NO_WRITE_FS: true,
  'process.env': {
    'NODE_ENV': JSON.stringify(nodeEnv),
  },
});
plugins.push(definePlugin);


if (!isProd) {
  const namedModulesPlugin = new webpack.NamedModulesPlugin();
  plugins.push(namedModulesPlugin);

  const noErrorsPlugin = new webpack.NoErrorsPlugin();
  plugins.push(noErrorsPlugin);
}

const devServer = {
  inline: true,
  host: '0.0.0.0',
};

module.exports = {
  devtool,
  entry,
  output,
  externals,
  module: {
    loaders,
  },  
  resolve,
  plugins,
  devServer,
};
