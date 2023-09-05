<template>
    <div id="app">
        <img>
        <div id="shade" :style="{
            position: 'absolute',
            width: fullScreenWidth + 'px',
            height: fullScreenHeigh + 'px',
            backgroundColor: 'rgba(0,0,0,0.4)'
        }" v-show="isShowShade"></div>
        <canvas id="screenShot" v-show="isShowScreenShotCanvas"></canvas>
        <canvas id="drawScreenShotCanvas" v-show="isShowDrawCanvas" :style="{
            position: 'absolute',
            left: startX + 'px',
            top: startY + 'px',
            width: (endX-startX) + 'px',
            height: (endY-startY) + 'px',
        }"></canvas>
        <div v-show="isShowScreenShotBorder" id="screenShotBorder" :style="{
            position: 'absolute',
            left: startX + 'px',
            top: startY + 'px',
            width: (endX-startX) + 'px',
            height: (endY-startY) + 'px',
            border: '2px solid black',
            backgroundColor: 'rgba(255,255,255,0.4)'
        }" @mousedown="moveStartPostion" @mousemove="movePostion" @mouseup="moveEndPostion">
        </div>
        <div v-show="isShowFirstSetting" :style="{
            position: 'absolute',
            left: startX +'px',
            top: endY + 'px',
            width: 300 + 'px',
            height: 40 + 'px',
        }">
            <button @click="editScreenShot" title="编辑">
                <svg t="1693920782639" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20161" width="30" height="30"><path d="M862.709333 116.042667a32 32 0 1 1 45.248 45.248L455.445333 613.813333a32 32 0 1 1-45.258666-45.258666L862.709333 116.053333zM853.333333 448a32 32 0 0 1 64 0v352c0 64.8-52.533333 117.333333-117.333333 117.333333H224c-64.8 0-117.333333-52.533333-117.333333-117.333333V224c0-64.8 52.533333-117.333333 117.333333-117.333333h341.333333a32 32 0 0 1 0 64H224a53.333333 53.333333 0 0 0-53.333333 53.333333v576a53.333333 53.333333 0 0 0 53.333333 53.333333h576a53.333333 53.333333 0 0 0 53.333333-53.333333V448z" fill="#000000" p-id="20162"></path></svg>
            </button>
            <button @click="saveScreenShot" title="保存">
                <svg t="1693918820464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17508" width="30" height="30"><path d="M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z" p-id="17509"></path></svg>
            </button>
            <button @click="closeScreenShot" title="关闭">
                <svg t="1693912388156" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13023" width="30" height="30"><path d="M548.992 503.744L885.44 167.328a31.968 31.968 0 1 0-45.248-45.248L503.744 458.496 167.328 122.08a31.968 31.968 0 1 0-45.248 45.248l336.416 336.416L122.08 840.16a31.968 31.968 0 1 0 45.248 45.248l336.416-336.416L840.16 885.44a31.968 31.968 0 1 0 45.248-45.248L548.992 503.744z" p-id="13024"></path></svg>
            </button>
            <button @click="copyToclipboard" title="复制到剪切版并关闭">
                <svg t="1693910864640" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7884" width="30" height="30"><path d="M1011.2 186.181818c-13.963636-13.963636-37.236364-13.963636-51.2 0l-577.163636 577.163637-321.163637-316.509091c-13.963636-13.963636-37.236364-13.963636-51.2 0-13.963636 13.963636-13.963636 37.236364 0 51.2l344.436364 344.436363c13.963636 13.963636 37.236364 13.963636 51.2 0l605.090909-605.090909c13.963636-13.963636 13.963636-37.236364 0-51.2z" p-id="7885"></path></svg>
            </button>
        </div>
        <div v-show="isShowSecondSetting" :style="{
            position: 'absolute',
            left: startX +'px',
            top: endY + 'px',
            width: 300 + 'px',
            height: 40 + 'px',
        }"> 
            <button @click="drawScreenShot" title="画笔">
                <svg t="1693921728717" class="icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32922" width="30" height="30"><path d="M990.595227 285.308773 742.947854 35.944695C696.221042-11.103373 616.792202-11.103373 570.061087 35.944695L93.450756 511.155272C74.766342 525.267541 65.415529 544.086768 60.74586 567.60865L0 915.784426C0 944.013266 9.345076 976.946196 28.033793 995.77116 46.729681 1014.58465 70.083765 1024 98.131899 1024L112.146644 1024 457.914443 962.833927C481.278566 958.125535 499.975888 948.715922 513.989199 929.900997L990.593793 454.691854C1013.95935 431.164235 1027.974095 402.933961 1027.974095 370.002465 1027.975529 337.063798 1013.960784 308.837826 990.595227 285.308773L990.595227 285.308773ZM448.573669 868.729188 98.126162 929.900997 158.864852 581.726655 509.315227 233.552314 799.024045 520.560583 448.573669 868.729188 448.573669 868.729188ZM925.178263 388.817389 859.764168 459.400246 570.061087 172.390543 635.475182 106.520381C644.821692 97.112202 663.511843 97.112202 677.525154 106.520381L925.178263 355.885894C929.853669 360.594286 934.524773 370.002465 934.524773 374.70512 934.524773 379.407776 929.855104 384.116168 925.178263 388.817389L925.178263 388.817389Z" fill="#272536" p-id="32923"></path></svg>
            </button>
            <button @click="withdraw" title="撤回">
                <svg t="1693921117699" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21985" width="30" height="30"><path d="M329.045333 137.685333a32 32 0 0 1 48.128 41.984l-2.858666 3.285334L215.893333 341.333333l158.421334 158.378667a32 32 0 0 1 2.858666 41.984l-2.858666 3.285333a32 32 0 0 1-41.984 2.858667l-3.285334-2.858667L148.053333 363.946667a32 32 0 0 1-2.858666-41.984l2.858666-3.242667 180.992-181.034667z" fill="#000000" p-id="21986"></path><path d="M640 309.333333a245.333333 245.333333 0 0 1 9.386667 490.496l-9.386667 0.170667H170.666667a32 32 0 0 1-4.352-63.701333L170.666667 736h469.333333a181.333333 181.333333 0 0 0 8.789333-362.453333L640 373.333333H170.666667a32 32 0 0 1-4.352-63.701333L170.666667 309.333333h469.333333z" fill="#000000" p-id="21987"></path></svg>
            </button>
        </div>
    </div>
</template>
  
<script>
import { ipcRenderer } from 'electron'
//canvas为截图画布，img显示截图
let canvas,ctx,img,drawCanvas,drawctx
const devicePixelRatio = window.devicePixelRatio
export default{
    data(){
        return{
            fullScreenWidth:0, //窗口大小
            fullScreenHeigh:0,
            isShortsCut:false,//是否是快捷键打开的窗口
            isShowScreenShotCanvas:false,//绘制截图的画布
            isShowShade:true,//黑幕遮罩
            isShowDrawCanvas:false,//画笔的画布
            /*
                与设置相关的数据
            */
            isShowFirstSetting:false, //一级设置
            isShowSecondSetting:false, //编辑截图设置
            CanvasEventListener:false, //画布有无设置鼠标监听事件
            /*
                与画布相关的数据
            */
            isDrawing:false, //画笔有无落下
            isSelect:'', //当前的选择，画笔,橡皮擦等等
            /*
                与截图框有关的数据
            */
            isShowScreenShotBorder:false,//显示截图框
            isShowCutScreen:false,
            moveShowCutScreen:false,//截图框是否移动
            stopMoveCutScreen:false,//静止截图框移动
            width:0, //截图框的宽度
            height:0,
            moveX:0, //移动截图框时鼠标与startX的差值
            moveY:0,
            startX:0, //截图框的位置
            startY:0,
            endX:0,
            endY:0
        }
    },
    methods:{
        closeScreenShot(){
            ipcRenderer.send('closeScreenShot',this.isShortsCut)
        }, //关闭窗口函数
        getScreenShotImage(){
            img=document.querySelector('img')
            let startX = this.startX*devicePixelRatio
            let startY = this.startY*devicePixelRatio
            let width = this.width*devicePixelRatio
            let height = this.height*devicePixelRatio
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img,startX,startY,width,height,0,0,width,height)
        },//画布获取截图
        
        //一级设置相关的函数

        editScreenShot(){
            this.isShowFirstSetting = false
            this.isShowSecondSetting = true
            this.stopMoveCutScreen = true //当进入编辑截图时截图框不能移动
        },//进入编辑截图
        copyToclipboard(){
            this.getScreenShotImage()
            //将canvas变成blob对象，然后使用clipboard复制到剪切板中
            canvas.toBlob((blob)=>{
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(()=>{
                    this.closeScreenShot()
                }).catch((err)=>console.log(err))
            })          
        },//复制到剪切板
        saveScreenShot(){
           this.getScreenShotImage()
           let url = canvas.toDataURL()
           ipcRenderer.send('openDialog','save',url)
        },//保存截图

        //二级设置相关的函数

        drawScreenShot(){
            // let self = this
            // drawCanvas = document.getElementById('drawScreenShotCanvas')
            // drawctx = drawCanvas.getContext('2d')
            // this.isShowDrawCanvas = true
            // drawCanvas.width = this.width*devicePixelRatio
            // drawctx.height = this.height*devicePixelRatio
            // this.isSelect = 'draw'
            // if(!this.CanvasEventListener){
            //     drawCanvas.addEventListener('mousedown',(e)=>{
            //         console.log('a')
            //         self.startMoveOnCanvas(e)
            //     } )
            //     drawCanvas.addEventListener('mousemove',this.MoveOnCanvas())
            //     drawCanvas.addEventListener('mouseup',this.stopMoveOnCanvas())    
            // }
            // this.CanvasEventListener = true

        },//绘制截图
        withdraw(){
            this.isShowFirstSetting = true
            this.isShowSecondSetting = false
        },//撤回

        //画布移动相关的函数

        startMoveOnCanvas(e){
            if(this.isSelect==='draw'){
               if(this.isDrawing) return
               this.isDrawing = true
               drawctx.beginPath()
               drawctx.moveTo(e.offsetX, e.offsetY)
            }
        },
        MoveOnCanvas(e){
            if(this.isSelect==='draw'){
                if(!this.isDrawing) return
                drawctx.lineTo(e.offsetX*devicePixelRatio,e.offsetY*devicePixelRatio)
                drawctx.stroke()
            }
        },
        stopMoveOnCanvas(e){
            if(this.isSelect==='draw'){
                if(!this.isDrawing) return
                this.isDrawing = false
                drawctx.closePath()
            }
        },

        //与截图框位置大小有关的函数

        getStartPostion(e){
            if(e.button==2){
                this.closeScreenShot()  
                return
            } 
            if(this.isShowCutScreen) return
            this.isShowCutScreen = true
            this.isShowScreenShotBorder = true
            this.startX = e.clientX
            this.startY = e.clientY
        },
        getlastPostion(e){
            if(!this.isShowCutScreen) return
            this.endX = e.clientX
            this.endY = e.clientY
        },//获取移动时的坐标
        getfinallyPostion(){
            if(!this.isShowCutScreen||this.stopMoveCutScreen) return
            this.width = this.endX - this.startX
            this.height = this.endY - this.startY
            document.removeEventListener('mousemove',this.getlastPostion)
            this.isShowShade = false
            this.isShowFirstSetting = true
            document.getElementById('screenShotBorder').style.backgroundColor = 'transparent'
        },//删除mousemove的监听事件
        
        //截图框移动
        
        moveStartPostion(e){
            if(this.moveShowCutScreen||this.stopMoveCutScreen) return
            this.moveShowCutScreen = true
            this.moveX = e.clientX - this.startX
            this.moveY = e.clientY - this.startY
        },
        movePostion(e){
            if(!this.moveShowCutScreen||this.stopMoveCutScreen) return
            this.startX = Math.max((e.clientX - this.moveX),0) 
            this.startY = Math.max((e.clientY - this.moveY),0) 
            if(this.startX+this.width>this.fullScreenWidth){
               this.endX = this.fullScreenWidth 
               this.startX = this.endX - this.width
            }else{
                this.endX = this.startX + this.width
            }
            if(this.startY+this.height>this.fullScreenHeigh){
                this.endY = this.fullScreenHeigh
                this.startY = this.endY - this.height
            }else{
                this.endY = this.startY + this.height
            }
        },
        moveEndPostion(){
            if(!this.moveShowCutScreen||this.stopMoveCutScreen) return
            this.moveShowCutScreen = false
        }
    },
    mounted(){
        ipcRenderer.send('getFullScreen')
        ipcRenderer.on('sendFullScreen', async(event,image,size) => { 
            const {width,height} = size
            this.fullScreenWidth = width -4
            this.fullScreenHeigh = height -4
            img = document.querySelector('img')
            img.src = image 
        })
        canvas = document.getElementById('screenShot')
        ctx = canvas.getContext('2d')
        document.addEventListener('mousedown',this.getStartPostion)
        document.addEventListener('mousemove',this.getlastPostion)
        document.addEventListener('mouseup',this.getfinallyPostion)
    },
    beforeDestroy(){
        document.removeEventListener('mousedown',this.getStartPostion)
        document.removeEventListener('mousemove',this.getlastPostion)
        document.removeEventListener('mouseup',this.getfinallyPostion)
    }
}
  
  </script>
  
  <style scoped>
  img{
    position: absolute;
    height: 100%;
    width: 100%;
    border: none;
    padding: 0px;
  }
  </style>