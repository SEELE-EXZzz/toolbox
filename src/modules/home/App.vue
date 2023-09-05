<template>
  <div id="app">
      <div>
        <img src="../../logo/截图logo.png" alt="" @click="openScreenShot">
        <img src="../../logo/便利贴logo.png" alt="" @click="openStickyNote">
      </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default{
    methods:{
      openScreenShot(){
        ipcRenderer.send('openScreenShot')
      },
      openStickyNote(){
        ipcRenderer.send('openStickyNote')
      }
    },
}

</script>

<style scoped>
img{
  width: 50px;
  margin: 10px;
}
</style>
