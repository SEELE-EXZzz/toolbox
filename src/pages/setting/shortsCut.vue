<template>
    <div id="app">
        <div class="grid-container">
            <div class="grid-item">
                <img src="../../logo/截图logo.png">
            </div>
            <div class="grid-item flex-item">
                <div class="flex-item-inner">
                    <span>截图:</span>
                    <input type="text" v-model="screenShotShortsCut" @input="getShortsCut($event,'screenShotShortsCut')" @keydown="getCtrlOrShift($event,'screenShotShortsCut')"> 
                    <el-button type="primary" @click="clearShortsCut('screenShotShortsCut')">
                        <svg t="1694330048103" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4022" width="14" height="14"><path d="M14.08 919.296L919.424 14.208l90.496 90.496L104.704 1009.92z" fill="#666666" p-id="4023"></path><path d="M104.704 14.08l905.088 905.216-90.496 90.496L14.08 104.704z" fill="#666666" p-id="4024"></path></svg>
                    </el-button>
                    <el-button type="primary" @click="recordShortsCut('screenShotShortsCut')">
                        <svg t="1694330083734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4999" width="14" height="14"><path d="M1013.696842 184.811146c-6.082532-6.082532-14.171768-9.43386-22.774703-9.43386s-16.692171 3.350304-22.775726 9.43386l-586.755588 586.756611-325.539284-325.537238c-6.083555-6.084579-14.172791-9.43693-22.776749-9.43693-8.602935 0-16.692171 3.351328-22.774703 9.434883-6.083555 6.082532-9.434883 14.172791-9.434883 22.775726 0 8.603959 3.349281 16.692171 9.43386 22.776749l347.610976 347.609952c6.082532 6.081509 14.171768 9.432837 22.773679 9.432837 0.236384 0 0.470721-0.01228 0.705058-0.017396 0.23536 0.005117 0.469698 0.017396 0.705058 0.017396 8.603959 0 16.692171-3.350304 22.775726-9.432837l608.826256-608.828302c6.083555-6.083555 9.43386-14.172791 9.43386-22.776749C1023.131725 198.98189 1019.78142 190.893678 1013.696842 184.811146z" p-id="5000"></path></svg>
                    </el-button>
                </div>
            </div>
            <div class="grid-item">
                <img src="../../logo/便利贴logo.png">
            </div>
            <div class="grid-item flex-item">
                <div class="flex-item-inner">
                    <span>创建便利贴:</span>
                    <input type="text" v-model="createStickyNoteShortsCut" @input="getShortsCut($event,'createStickyNoteShortsCut')" @keydown="getCtrlOrShift($event,'createStickyNoteShortsCut')">  
                    <el-button type="primary" @click="clearShortsCut('createStickyNoteShortsCut')">
                        <svg t="1694330048103" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4022" width="14" height="14"><path d="M14.08 919.296L919.424 14.208l90.496 90.496L104.704 1009.92z" fill="#666666" p-id="4023"></path><path d="M104.704 14.08l905.088 905.216-90.496 90.496L14.08 104.704z" fill="#666666" p-id="4024"></path></svg>
                    </el-button>
                    <el-button type="primary" @click="recordShortsCut('createStickyNoteShortsCut')">
                        <svg t="1694330083734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4999" width="14" height="14"><path d="M1013.696842 184.811146c-6.082532-6.082532-14.171768-9.43386-22.774703-9.43386s-16.692171 3.350304-22.775726 9.43386l-586.755588 586.756611-325.539284-325.537238c-6.083555-6.084579-14.172791-9.43693-22.776749-9.43693-8.602935 0-16.692171 3.351328-22.774703 9.434883-6.083555 6.082532-9.434883 14.172791-9.434883 22.775726 0 8.603959 3.349281 16.692171 9.43386 22.776749l347.610976 347.609952c6.082532 6.081509 14.171768 9.432837 22.773679 9.432837 0.236384 0 0.470721-0.01228 0.705058-0.017396 0.23536 0.005117 0.469698 0.017396 0.705058 0.017396 8.603959 0 16.692171-3.350304 22.775726-9.432837l608.826256-608.828302c6.083555-6.083555 9.43386-14.172791 9.43386-22.776749C1023.131725 198.98189 1019.78142 190.893678 1013.696842 184.811146z" p-id="5000"></path></svg>
                    </el-button>    
                </div>
                <div class="flex-item-inner">
                    <span>隐藏全部便利贴:</span>
                    <input type="text" v-model="hideStickyNoteShortsCut" @input="getShortsCut($event,'hideStickyNoteShortsCut')" @keydown="getCtrlOrShift($event,'hideStickyNoteShortsCut')"> 
                    <el-button type="primary" @click="clearShortsCut('hideStickyNoteShortsCut')">
                        <svg t="1694330048103" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4022" width="14" height="14"><path d="M14.08 919.296L919.424 14.208l90.496 90.496L104.704 1009.92z" fill="#666666" p-id="4023"></path><path d="M104.704 14.08l905.088 905.216-90.496 90.496L14.08 104.704z" fill="#666666" p-id="4024"></path></svg>
                    </el-button>
                    <el-button type="primary" @click="recordShortsCut('hideStickyNoteShortsCut')">
                        <svg t="1694330083734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4999" width="14" height="14"><path d="M1013.696842 184.811146c-6.082532-6.082532-14.171768-9.43386-22.774703-9.43386s-16.692171 3.350304-22.775726 9.43386l-586.755588 586.756611-325.539284-325.537238c-6.083555-6.084579-14.172791-9.43693-22.776749-9.43693-8.602935 0-16.692171 3.351328-22.774703 9.434883-6.083555 6.082532-9.434883 14.172791-9.434883 22.775726 0 8.603959 3.349281 16.692171 9.43386 22.776749l347.610976 347.609952c6.082532 6.081509 14.171768 9.432837 22.773679 9.432837 0.236384 0 0.470721-0.01228 0.705058-0.017396 0.23536 0.005117 0.469698 0.017396 0.705058 0.017396 8.603959 0 16.692171-3.350304 22.775726-9.432837l608.826256-608.828302c6.083555-6.083555 9.43386-14.172791 9.43386-22.776749C1023.131725 198.98189 1019.78142 190.893678 1013.696842 184.811146z" p-id="5000"></path></svg>
                    </el-button>                    
                </div>
                <div class="flex-item-inner">
                    <span>显示全部便利贴:</span>
                    <input type="text" v-model="showStickyNoteShortsCut" @input="getShortsCut($event,'showStickyNoteShortsCut')" @keydown="getCtrlOrShift($event,'showStickyNoteShortsCut')"> 
                    <el-button type="primary"  @click="clearShortsCut('showStickyNoteShortsCut')">
                        <svg t="1694330048103" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4022" width="14" height="14"><path d="M14.08 919.296L919.424 14.208l90.496 90.496L104.704 1009.92z" fill="#666666" p-id="4023"></path><path d="M104.704 14.08l905.088 905.216-90.496 90.496L14.08 104.704z" fill="#666666" p-id="4024"></path></svg>
                    </el-button>
                    <el-button type="primary" @click="recordShortsCut('showStickyNoteShortsCut')">
                        <svg t="1694330083734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4999" width="14" height="14"><path d="M1013.696842 184.811146c-6.082532-6.082532-14.171768-9.43386-22.774703-9.43386s-16.692171 3.350304-22.775726 9.43386l-586.755588 586.756611-325.539284-325.537238c-6.083555-6.084579-14.172791-9.43693-22.776749-9.43693-8.602935 0-16.692171 3.351328-22.774703 9.434883-6.083555 6.082532-9.434883 14.172791-9.434883 22.775726 0 8.603959 3.349281 16.692171 9.43386 22.776749l347.610976 347.609952c6.082532 6.081509 14.171768 9.432837 22.773679 9.432837 0.236384 0 0.470721-0.01228 0.705058-0.017396 0.23536 0.005117 0.469698 0.017396 0.705058 0.017396 8.603959 0 16.692171-3.350304 22.775726-9.432837l608.826256-608.828302c6.083555-6.083555 9.43386-14.172791 9.43386-22.776749C1023.131725 198.98189 1019.78142 190.893678 1013.696842 184.811146z" p-id="5000"></path></svg>
                    </el-button>                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ipcRenderer} from 'electron'
const Store = require('electron-store')
const shortsCutStore = new Store({name: 'shortsCut'})
export default{
    data(){
        return{
            screenShotShortsCut:'',//截图的快捷键
            createStickyNoteShortsCut:'',//创建便利贴的快捷键
            hideStickyNoteShortsCut:'',//隐藏便利贴的快捷键
            showStickyNoteShortsCut:'',//显示便利贴的快捷键
            shortsCutList:[],//记录已设置的快捷键以免重合   
        }
    },
    methods:{
        getCtrlOrShift(e,type){
            if(!this[type]){
                if(e.key==='Control'||e.key==='Shift'){
                    let key = e.key
                    if(key==='Control') key = 'Ctrl'
                    this[type] = key
                }
            }else if(this[type]==='Ctrl'&&e.key==='Shift'){
                this[type] = 'Ctrl+Shift'
            }
        },
        getShortsCut(e,type){
            let str1 = 'Ctrl',str2 = 'Shift',path = '',str,strList
            if(this[type].indexOf(str1)==-1&&this[type].indexOf(str2)==-1) this[type] = ''
            if(this[type].indexOf(str1)!=-1){
                if(this[type].indexOf(str2)!=-1){
                    path = this[type].slice(0,10)
                    str = this[type].slice(10)
                }else{
                    path = this[type].slice(0,4)
                    str = this[type].slice(4)
                } 
            }else if(this[type].indexOf(str2)!=-1){
                path = this[type].slice(0,5)
                str = this[type].slice(5)
            }
            if(!/[A-Z]/.test(str)&&str&&str.match(/[a-z]/g)){
                strList = str.match(/[a-z]/g)
                str = strList[0]
                for(let i=1;i<strList.length;i++){
                    if(strList[i]!=str){
                        str = str + '+' + strList[i]
                        break
                    }
                }
                this[type] = path + '+' + str
            }else{
                this[type] = path
            }
        },
        recordShortsCut(type){
            for(let i=0;i<this.shortsCutList.length;i++){
                const {key,value} = this.shortsCutList[i]
                if(value===this[type]&&key!=type){
                    this[type] = ''
                    return
                }
            }
            const Obj = {
                key : type,
                value : this[type]
            }
            this.shortsCutList.push(Obj)
            ipcRenderer.send('getShortsCut',type,this[type])
        },
        clearShortsCut(type){
            for(let i=0;i<this.shortsCutList.length;i++){
                const {key,value} = this.shortsCutList[i]
                if(value===this[type]){
                    this.shortsCutList.splice(i,1)
                }
            }
            this[type] = ''
            ipcRenderer.send('deleteShortsCut',type,this[type])
        }
    },
    mounted(){
        if(shortsCutStore.size>0){
            let store = shortsCutStore.store
            Object.entries(store).forEach(([key,value])=>{
                this[key] = value
                const obj = {
                    key,
                    value
                }
                this.shortsCutList.push(obj)
            })
        }
    }
}

</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 6fr; /* 两列，第二列与第一列的宽度为6:1 */
  grid-template-rows: 1fr 3fr; /* 两行，第二行与第一行的高度比为3:1 */
  grid-gap: 4px; /* 单元格之间的间隙 */
}

.grid-item {
  padding: 4px;
  margin: 4px;
}
.flex-item {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: space-between;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4)
}
.flex-item-inner {
  flex: 0 0 calc(33.33% - 10px);
  padding: 4px;
}
img{
  width: 50px;
}
input{
    width: 100px;
    margin: 10px;
}
</style>