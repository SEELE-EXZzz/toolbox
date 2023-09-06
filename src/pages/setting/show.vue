<template>
    <div id="app">
        <span>启动时主窗口显示:</span><el-switch v-model="showMainWindow" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch('showMainWindow')"></el-switch>
        <span>启动时便利贴显示:</span><el-switch v-model="showStickyNote" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch('showStickyNote')"></el-switch>
    </div>
</template>

<script>
const Store = require('electron-store')
const settingShowStore = new Store({name: 'settingShow'})
export default{
    data(){
        return{
            showMainWindow:true,
            showStickyNote:true
        }
    },
    methods:{
        changeSwitch(type){
            settingShowStore.set(type,this[type])
        }
    },
    mounted(){
        if(settingShowStore.size>0){
            if(settingShowStore.has('showMainWindow')){
                this.showMainWindow = settingShowStore.get('showMainWindow')
            }
            if(settingShowStore.has('showStickyNote')){
                this.showStickyNote = settingShowStore.get('showStickyNote')
            }
        }
    }
}

</script>

<style scoped>
span{
    margin: 8px;
}
</style>