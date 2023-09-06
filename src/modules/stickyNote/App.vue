<template>
    <div id="app">
      <textarea spellcheck=false></textarea>
      <button @click="recordStickyNote" id="record">
        <svg t="1694008013900" class="icon" viewBox="0 0 1035 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14476" width="26" height="26"><path d="M833.161206 82.125397H763.444285V59.235435c0-24.605317-19.949354-44.554671-44.554671-44.554671H316.081974c-24.605317 0-44.554671 19.949354-44.554671 44.554671v22.889962h-69.716921c-56.651264 0-102.731932 46.091807-102.731933 102.731932v734.428056c0 56.651264 46.091807 102.731932 102.731933 102.731932h631.350824c56.651264 0 102.731932-46.091807 102.731932-102.731932V184.857329c0-56.651264-46.091807-102.731932-102.731932-102.731932zM360.636644 103.790106H674.334943v30.330592H360.636644V103.790106z m486.147153 815.495279c0 7.518601-6.115129 13.622591-13.622591 13.62259H201.810382c-7.518601 0-13.622591-6.115129-13.622591-13.62259V184.857329c0-7.518601 6.115129-13.622591 13.622591-13.62259h69.716921v7.44063c0 24.605317 19.949354 44.554671 44.554671 44.554671H718.889614c24.605317 0 44.554671-19.949354 44.554671-44.554671v-7.44063h69.716921c7.518601 0 13.622591 6.115129 13.622591 13.62259v734.428056z m-70.841927-563.883914c0 24.605317-19.949354 44.554671-44.554671 44.55467H303.584388c-24.605317 0-44.554671-19.949354-44.55467-44.55467s19.949354-44.554671 44.55467-44.554671h427.802811c24.605317 0 44.554671 19.949354 44.554671 44.554671z m0 193.333855c0 24.605317-19.949354 44.554671-44.554671 44.554671H303.584388c-24.605317 0-44.554671-19.949354-44.55467-44.554671s19.949354-44.554671 44.55467-44.554671h427.802811c24.605317 0 44.554671 19.949354 44.554671 44.554671z m0 193.333856c0 24.605317-19.949354 44.554671-44.554671 44.55467H303.584388c-24.605317 0-44.554671-19.949354-44.55467-44.55467s19.949354-44.554671 44.55467-44.554671h427.802811c24.605317 0 44.554671 19.949354 44.554671 44.554671z" p-id="14477"></path></svg>
      </button>
      <button @click="clearStickyNote" id="clear">
        <svg t="1694005072416" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12575" width="26" height="26"><path d="M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6c-0.3 1.5-0.4 3-0.4 4.4 0 14.4 11.6 26 26 26h723c1.5 0 3-0.1 4.4-0.4 14.2-2.4 23.7-15.9 21.2-30zM204 390h272V182h72v208h272v104H204V390z m468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z" p-id="12576"></path></svg>
      </button>
    </div>
  </template>
  
  <script>
  import {ipcRenderer} from 'electron'
  const Store = require('electron-store')
  const stickyNoteStore = new Store({name: 'stickyNote'})
  export default{
      data(){
        return{
            id:'',//窗口id
            key:'',//electron-store的键值
            ismove:false,
            moveX:'', //移动时鼠标与左边坐标的差值
            moveY:'',
            x,//窗口的坐标
            y
        }
      },
      methods:{
        clearStickyNote(){
            ipcRenderer.send('closeStickyNote',this.id)
        }, //清除便利贴
        recordStickyNote(){
            let value = document.querySelector('textarea').value
            let time = Date.now()
            if(!this.key) this.key = time //如果键是空就赋予时间戳
            stickyNoteStore.set(this.key,value)
        }, //记录便利贴内容
        /*
            与便利贴移动相关的函数
        */
        getStartPostion(e){
            if(this.ismove) return
            this.ismove = true
            this.moveX = e.clientX-this.x
            this.moveY = e.clientY-this.y
        },
        getMovePostion(e){
            if(!this.ismove) return
            let x = e.clientX-this.moveX
            let y = e.clientY-this.moveY
            ipcRenderer.send('getStickyNoteMovePostion',this.id,x,y)
        },
        getlastPostion(){
            if(!this.ismove) return
            this.ismove = false
        }
      },
      mounted(){
        ipcRenderer.on('sendStickyData',(e,id,width,height)=>{
            this.x = width
            this.y = height
            this.id = id
        })
        document.addEventListener('mousedown',this.getStartPostion)
        document.addEventListener('mousemove',this.getMovePostion)
        document.addEventListener('mouseup',this.getlastPostion)
      },
      beforeDestroy(){
        document.removeEventListener('mousedown',this.getStartPostion)
        document.removeEventListener('mousemove',this.getMovePostion)
        document.removeEventListener('mouseup',this.getlastPostion)
      }
  }
  
  </script>
  
  <style scoped>
    #app{
        width: 200px;
        height: 200px;
        overflow: hidden;
    }
    textarea{
        width: 200px;
        height: 160px;
        border: 0px;
        padding: 0px;
        overflow: hidden;
        resize: none;
        outline: none;
        font-size: 16px;
    }
    button{
        height: 30px;
    }
    #record{
        float: right;
    }
  </style>