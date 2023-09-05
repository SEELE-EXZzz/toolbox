const { defineConfig } = require('@vue/cli-service')
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  pages: {
    main: {
      entry: 'src/modules/home/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Home Page'
    },
    screenShot: {
      entry: 'src/modules/screenShot/main.js',
      template: 'public/screenShot.html',
      filename: 'screenShot.html',
      title: 'screenShot Page'
    }
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "fs": false,
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify")
      }
    }
  },
  pluginOptions:{
    electronBuilder:{
      nodeIntegration:true
    }
  }
})
// module.exports = defineConfig({
//   ,
// })
