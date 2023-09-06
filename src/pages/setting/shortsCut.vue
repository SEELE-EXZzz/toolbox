<template>
    <div id="app">
        <div class="grid-container">
            <div class="grid-item">
                <img src="../../logo/截图logo.png">
            </div>
            <div class="grid-item">
                <input type="text"> 
                <el-button type="primary" icon="el-icon-close"></el-button>
                <el-button type="primary" icon="el-icon-check"></el-button>
            </div>
            <div class="grid-item">Item 3</div>
            <div class="grid-item">Item 4</div>
        </div>
    </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default{
    data(){
        return{
            screenShotShortsCut:''//截图的快捷键    
        }
    }
}

</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 4fr; /* 两列，每列占据相同的宽度 */
  grid-template-rows: 1fr 3fr; /* 两行，每行占据相同的高度 */
  grid-gap: 4px; /* 单元格之间的间隙 */
}

.grid-item {
  /* background-color: #e0e0e0; */
  padding: 4px;
  margin: 10px;
}
img{
  width: 50px;
}
input{
    width: 100px;
    margin: 10px;
}
</style>