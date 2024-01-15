/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const urlDev = "https://localhost:5000/";
const urlProd = "https://www.contoso.com/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      vendor: ["react", "react-dom", "core-js", "@fluentui/react-components", "@fluentui/react-icons"],
      "insert-gist": ["./src/pages/insert-gist/index.tsx", "./src/pages/insert-gist/insert-gist.html"],
      settings: ["./src/pages/settings/index.tsx", "./src/pages/settings/settings.html"],
      commands: ["./src/pages/commands/commands.ts", "./src/pages/commands/commands.html"],
      home: ["./src/pages/home/index.tsx", "./src/pages/home/home.html"],
      login: ["./src/pages/login/index.tsx", "./src/pages/login/login.html"],
      "login-success": ["./src/pages/login-success/index.ts", "./src/pages/login-success/login-success.html"],
    },
    output: {
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
        {
          test: /\.module\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "insert-gist.html",
        template: "./src/pages/insert-gist/insert-gist.html",
        chunks: ["polyfill", "vendor", "insert-gist"],
      }),
      new HtmlWebpackPlugin({
        filename: "settings.html",
        template: "./src/pages/settings/settings.html",
        chunks: ["polyfill", "vendor", "settings"],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/pages/commands/commands.html",
        chunks: ["polyfill", "vendor", "commands"],
      }),
      new HtmlWebpackPlugin({
        filename: "home.html",
        template: "./src/pages/home/home.html",
        chunks: ["polyfill", "vendor", "home"],
      }),
      new HtmlWebpackPlugin({
        filename: "login.html",
        template: "./src/pages/login/login.html",
        chunks: ["polyfill", "vendor", "login"],
      }),
      new HtmlWebpackPlugin({
        filename: "login-success.html",
        template: "./src/pages/login-success/login-success.html",
        chunks: ["login-success"],
      }),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"],
      }),
    ],
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port ?? 5000,
    },
  };

  return config;
};
