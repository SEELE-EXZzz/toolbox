import { app, protocol, BrowserWindow,ipcMain,screen,desktopCapturer,dialog} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const Store = require('electron-store')
const fs = require('fs')
const stickyNoteStore = new Store({name: 'stickyNote'})

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let screenShot,win,stickyNote

//创建便利贴函数
const createStickyNote = async(width,height)=>{
  stickyNote = new BrowserWindow({
    autoHideMenuBar:true,  
    frame:false,
    width:200,
    height:200,
    maxHeight:200,
    maxWidth:200,
    minHeight:200,
    minWidth:200,
    x:width,
    y:height,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await stickyNote.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'stickyNote.html')
  } else {
    createProtocol('app')
    stickyNote.loadURL('app://./stickyNote.html')//加载页面
  }
  let id = stickyNote.id
  stickyNote.webContents.send('sendStickyData',id,width,height)
}

//创建截图函数
const createScreenShot=async()=>{
    screenShot= new BrowserWindow({
      autoHideMenuBar: true, // 自动隐藏菜单栏
      useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
      movable: false, // 是否可移动
      frame: false, // 无边框窗口
      resizable: false, // 窗口大小是否可调整
      hasShadow: false, // 窗口是否有阴影
      transparent: true, // 使窗口透明
      fullscreenable: true, // 窗口是否可以进入全屏状态
      fullscreen: true, // 窗口是否全屏
      simpleFullscreen: true, // 在 macOS 上使用 pre-Lion 全屏
      alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await screenShot.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'screenShot.html')
  } else {
    createProtocol('app')
    screenShot.loadURL('app://./screenShot.html')//加载页面
  }
}

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/*
  与截图功能相关的ipcMain
 */

ipcMain.on('openScreenShot',async()=>{
    win.hide()//主窗口隐藏
    // 创建一个全屏且隐藏菜单栏的窗口。
    createScreenShot()
})

ipcMain.on('getFullScreen',async() => {
  //获取屏幕大小,以及缩放因子scaleFactor。
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  const sources = await desktopCapturer.getSources({
    types:['screen'],
    thumbnailSize: {
      width:size.width*scaleFactor,
      height:size.height*scaleFactor
    }
  })
  // 向渲染进程发送屏幕截图
  let data = sources[0].thumbnail.toDataURL()
  screenShot.webContents.send('sendFullScreen',data,size)
})

ipcMain.on('closeScreenShot',(e,type)=>{
  screenShot.destroy()
  if(!type) win.show()
})

ipcMain.on('openDialog',(e,message,url)=>{
  if(message=='save'){
    dialog.showSaveDialog({
      defaultPath: '截图.jpg',
      filters: [{ name: 'Images', extensions: ['jpg'] }]
    }).then((result) => {
      if (!result.canceled) {
        // 将截图数据保存到文件
        const data = url.replace(/^data:image\/png;base64,/,'')
        fs.writeFile(result.filePath, data, 'base64', (error) => {
          if (error) {
            console.error('Failed to save screenshot:', error)
          } else {
            console.log('Screenshot saved:', result.filePath)
            screenShot.destroy()
          }
        })
      }
    }).catch((error) => {
      console.error('Save screenshot dialog error:', error)
    })
  }
})

/*
  与便利贴相关的ipcMain
*/

ipcMain.on('openStickyNote',()=>{
    let {width,height} = screen.getPrimaryDisplay().size
    createStickyNote(width-220,20)
})

ipcMain.on('closeStickyNote',(e,id)=>{
  BrowserWindow.fromId(id).close()
})

ipcMain.on('getStickyNoteMovePostion',(e,id,x,y)=>{
  console.log(x,y)
  BrowserWindow.fromId(id).setPosition(x,y)
})

/*
  与设置相关的ipcMain
*/

