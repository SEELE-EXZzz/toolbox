const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  pages: {
    main: {
      entry: 'src/modules/home/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Home Page'
    },
    stickyNote: {
      entry: 'src/modules/stickyNote/main.js',
      template: 'public/stickyNote.html',
      filename: 'stickyNote.html',
      title: 'stickyNote Page'
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
  pluginOptions: {
    electronBuilder: {
      nodeIntegration:true,
      builderOptions: {
        appId: "toolbox",
        productName: "toolbox",
        copyright: "Copyright © 2023 chunxi",
        directories: {
          buildResources: "build"
        },
        dmg: {
          background: "build/background.jfif",
          icon: "build/icons/icon.icns",
          iconSize: 100,
          contents: [
            {
              "x": 380,
              "y": 180,
              "type": "link",
              "path": "/Applications"
            },
            {
              "x": 130,
              "y": 180,
              "type": "file"
            }
          ],
          window: {
            width: 540,
            height: 380
          }
        },
        win: {
          requestedExecutionLevel: 'requireAdministrator',
          target: [
            'msi',
            'nsis'
          ],
          icon: "build/icons/icon.ico"
        },
        nsis: {
          oneClick: false,
          language: "2052",
          perMachine: true,
          allowToChangeInstallationDirectory: true
        }
      }
    }
  }
})
