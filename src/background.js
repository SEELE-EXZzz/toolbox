import { app, protocol, BrowserWindow,ipcMain,screen,desktopCapturer,dialog,Tray,Menu,globalShortcut} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const Store = require('electron-store')
const path = require('path')
const fs = require('fs')
const stickyNoteStore = new Store({name: 'stickyNote'})
const shortsCutStore = new Store({name: 'shortsCut'})
const settingShowStore = new Store({name: 'settingShow'})

let screenShot,win,stickyNote,trayClose=false
let showMainWindow = true,showStickyNote = true,openScreenShot = false
let stickyNoteIdList = [] //记录便利贴窗口的id，用于全部隐藏或关闭

if(settingShowStore.size>0){
  if(settingShowStore.has('showMainWindow')) showMainWindow = settingShowStore.get('showMainWindow')
  if(settingShowStore.has('showStickyNote')) showStickyNote = settingShowStore.get('showStickyNote')
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

//创建便利贴函数
const createStickyNote = ({width,height,content,key},show)=>{
  return new Promise((res,rej)=>{
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
      show:false,
      webPreferences: {
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      }
    })
    if(show) stickyNote.show()
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      stickyNote.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'stickyNote.html')
    } else {
      createProtocol('app')
      stickyNote.loadURL('app://./stickyNote.html')//加载页面
    }
    let window = {
      stickyNote,
      width,
      height,
      content,
      key,
      id:stickyNote.id
    }
    stickyNoteIdList.push(stickyNote.id)
    stickyNote.webContents.on('did-finish-load', () => {
      res(window);
    })
  })
}

//创建截图函数
const createScreenShot=async(type)=>{
    if(openScreenShot) return
    openScreenShot = true
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
  if(type) screenShot.webContents.send('isShortsCut',true)
}

// 根据electron-store创建便利贴
const createStickyNoteList = ()=>{
    if(stickyNoteStore.size>0){
        let {width,height} = screen.getPrimaryDisplay().size
        let noteheight = 20
        let store = stickyNoteStore.store
        let list = []
        width -= 220
        Object.entries(store).forEach(([key, value]) => {
          if(noteheight+200>height){
            width -=220
            noteheight = 20
          }
          let stickyNoteData={
              width,
              height:noteheight,
              key,
              content:value
          }
          list.push(stickyNoteData)
          noteheight+=220
        })
        Promise.all(list.map((data)=>createStickyNote(data,showStickyNote))).then((window)=>{
          window.forEach((data)=>{
            const {stickyNote,width,height,id,content,key} = data
            stickyNote.webContents.send('sendStickyData',id,width,height,content,key)
          })
        })
    }
}

//创建托盘
const createTray=()=>{
  let icon 
  try{
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      icon = path.join(__dirname,'./bundled/icon.png')
    } else {
      icon = path.join(__dirname, './icon.png')
    }
    const tray = new Tray(icon)
    tray.on('click',()=>win.show())
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          trayClose = true //标记为托盘退出此时应该退出
          app.quit()// 退出应用程序
        }
      }
    ])
    tray.setContextMenu(contextMenu)  
  }catch{

  }
  createWindow()
  win.on('close',(e)=>{
    if(!trayClose){
      e.preventDefault()
      win.hide()
    }
  })
}

//创建快捷键
const createShortsCut=(name,value)=>{
  if(name==='screenShotShortsCut'){
    globalShortcut.register(value,()=>{
      createScreenShot(true)
    })
  }else if(name==='createStickyNoteShortsCut'){
    globalShortcut.register(value,()=>{
      let width = screen.getPrimaryDisplay().size.width-220
      let obj = {
        width,
        height:20,
        content:'',
        key:''
      }
      createStickyNote(obj,true).then((window)=>{
        const {stickyNote,width,height,id,content,key} = window
        stickyNote.webContents.send('sendStickyData',id,width,height,content,key)
      })
    })
  }else if(name==='hideStickyNoteShortsCut'){
    globalShortcut.register(value,()=>{
        stickyNoteIdList.forEach((id)=>{
          BrowserWindow.fromId(id).hide()
        })
    })
  }else if(name==='showStickyNoteShortsCut'){
    globalShortcut.register(value,()=>{
        stickyNoteIdList.forEach((id)=>{
          BrowserWindow.fromId(id).show()
        })
    })
  }
}

//根据electron-store创建快捷键
const createShortsCutList=()=>{
  console.log(shortsCutStore.size)
  if(shortsCutStore.size>0){
    let store = shortsCutStore.store
    Object.entries(store).forEach(([key,value])=>{
       createShortsCut(key,value)
    })
  }
}

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show:false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  if(showMainWindow) win.show()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    win.loadURL(`file://${__dirname}/index.html/`)
  }
}

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
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
  createTray() //创建托盘
  createStickyNoteList() //根据electron-store创建便利贴
  createShortsCutList() //根据electron-store创建快捷键
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
    createScreenShot(false)
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
  openScreenShot = false
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
            openScreenShot = false
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
    let width = screen.getPrimaryDisplay().size.width-220
    let data = {
      width:width,
      height:20,
      content:'',
      key:''
    }
    createStickyNote(data,true).then((window)=>{
        const {stickyNote,width,height,id,content,key} = window
        stickyNote.webContents.send('sendStickyData',id,width,height,content,key)
    })
})

ipcMain.on('closeStickyNote',(e,id)=>{
  BrowserWindow.fromId(id).close()
})

ipcMain.on('getStickyNoteMovePostion',(e,id,x,y)=>{
  BrowserWindow.fromId(id).setPosition(x,y)
})

/*
  与设置相关的ipcMain
*/

ipcMain.on('getShortsCut',(e,name,value)=>{
    //如果electron-store记录了某个功能的快捷键,说明该功能之前有快捷键需将之前的快捷键注销。
    if(shortsCutStore.has(name)) globalShortcut.unregister(value)
    shortsCutStore.set(name,value)
    createShortsCut(name,value)
})

ipcMain.on('deleteShortsCut',(e,name,value)=>{
    //如果electron-store记录了某个功能的快捷键,则注销快捷键并删除electron-store相关键
    if(shortsCutStore.has(name)){
      globalShortcut.unregister(shortsCutStore.get(name))
      shortsCutStore.delete(name)
    }
})