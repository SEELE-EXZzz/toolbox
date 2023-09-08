<template>
    <div id="app">
        <img>
        <div id="shade" :style="{
            position: 'absolute',
            width: fullScreenWidth + 'px',
            height: fullScreenHeight + 'px',
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
        <canvas id="textCanvas"></canvas>
        <canvas id="clearCanvas" v-show="isShowClearCanvas" :style="{
            position: 'absolute',
            left: clearX - (clearSize/2) + 'px',
            top: clearY - (clearSize/2) + 'px',
            width: clearSize + 'px',
            height: clearSize + 'px',
            border:'2px solid black'
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
            width: 330 + 'px',
            height: 40 + 'px',
        }"> 
            <button id="draw" @click="drawScreenShot" title="画笔">
                <svg t="1693921728717" class="icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32922" width="30" height="30"><path d="M990.595227 285.308773 742.947854 35.944695C696.221042-11.103373 616.792202-11.103373 570.061087 35.944695L93.450756 511.155272C74.766342 525.267541 65.415529 544.086768 60.74586 567.60865L0 915.784426C0 944.013266 9.345076 976.946196 28.033793 995.77116 46.729681 1014.58465 70.083765 1024 98.131899 1024L112.146644 1024 457.914443 962.833927C481.278566 958.125535 499.975888 948.715922 513.989199 929.900997L990.593793 454.691854C1013.95935 431.164235 1027.974095 402.933961 1027.974095 370.002465 1027.975529 337.063798 1013.960784 308.837826 990.595227 285.308773L990.595227 285.308773ZM448.573669 868.729188 98.126162 929.900997 158.864852 581.726655 509.315227 233.552314 799.024045 520.560583 448.573669 868.729188 448.573669 868.729188ZM925.178263 388.817389 859.764168 459.400246 570.061087 172.390543 635.475182 106.520381C644.821692 97.112202 663.511843 97.112202 677.525154 106.520381L925.178263 355.885894C929.853669 360.594286 934.524773 370.002465 934.524773 374.70512 934.524773 379.407776 929.855104 384.116168 925.178263 388.817389L925.178263 388.817389Z" fill="#272536" p-id="32923"></path></svg>
            </button>
            <button id="clear" @click="clearScreenShot" title="橡皮擦">
                <svg t="1693964400306" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7086" width="30" height="30"><path d="M959.33 499.14L592.17 132.62 64.67 659.19 311.2 891.38h528.06v-67.83H634.35z m-95.83 0L604.69 757.5 333.35 486.64l258.82-258.36zM337.94 823.55l-176-165.78 123.52-123.3 271.31 270.86-18.25 18.22z" fill="#333333" p-id="7087"></path></svg>
            </button>
            <button id="text" @click="textScreenShot" title="文本">
                <svg t="1693964348267" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5245" width="30" height="30"><path d="M885.005342 152.185075c0 16.95823-13.750165 30.707372-30.709419 30.707372L169.703053 182.892447c-16.95823 0-30.708396-13.749142-30.708396-30.707372l0 0c0-16.959254 13.750165-30.708396 30.708396-30.708396l684.59287 0C871.255177 121.475656 885.005342 135.224798 885.005342 152.185075L885.005342 152.185075 885.005342 152.185075zM512.002047 902.523321c-16.963347 0-30.708396-13.745049-30.708396-30.707372L481.293651 153.189961c0-16.959254 13.746072-30.708396 30.708396-30.708396l0 0c16.95823 0 30.704302 13.749142 30.704302 30.708396l0 718.630081C542.706349 888.778272 528.960277 902.523321 512.002047 902.523321L512.002047 902.523321 512.002047 902.523321z" fill="#272636" p-id="5246"></path></svg>
            </button>
            <button @click="colorScreenShot" :style="{backgroundColor:color}">
                <svg t="1694163650280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4994" width="30" height="30"><path d="M475.2 903.2c-16.8 0-34.4-1.6-53.6-4l-4.8-0.8c-136-20.8-228.8-152.8-232.8-158.4-131.2-200-65.6-402.4 58.4-514.4 123.2-112 328.8-160 508.8-15.2C867.2 304 902.4 433.6 904 439.2v1.6c16.8 91.2 3.2 158.4-40.8 201.6-67.2 64.8-178.4 44-193.6 40.8-20.8-2.4-36 4-47.2 17.6-12 15.2-14.4 35.2-10.4 47.2 11.2 33.6 12.8 59.2 4.8 78.4-23.2 50.4-70.4 76.8-141.6 76.8z m-51.2-52.8l4.8 0.8c77.6 12 124.8-3.2 144-46.4 0-0.8 4-11.2-6.4-43.2-10.4-28.8-2.4-66.4 18.4-92 21.6-27.2 53.6-39.2 91.2-35.2l2.4 0.8c0.8 0 100 21.6 151.2-28 31.2-30.4 40.8-83.2 27.2-156.8-3.2-10.4-37.6-123.2-136.8-202.4-156.8-128-336.8-85.6-445.6 12.8C174.4 352 100.8 525.6 224 713.6c0.8 0 84.8 120 200 136.8z" fill="#999999" p-id="4995"></path><path d="M284 526.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" fill="#999999" p-id="4996"></path><path d="M340 382.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" fill="#999999" p-id="4997"></path><path d="M484 302.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" fill="#999999" p-id="4998"></path><path d="M644 342.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" fill="#999999" p-id="4999"></path><path d="M724 470.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" fill="#999999" p-id="5000"></path></svg>
            </button>
            <button @click="copyToclipboard" title="复制到剪切版并关闭">
                <svg t="1693910864640" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7884" width="30" height="30"><path d="M1011.2 186.181818c-13.963636-13.963636-37.236364-13.963636-51.2 0l-577.163636 577.163637-321.163637-316.509091c-13.963636-13.963636-37.236364-13.963636-51.2 0-13.963636 13.963636-13.963636 37.236364 0 51.2l344.436364 344.436363c13.963636 13.963636 37.236364 13.963636 51.2 0l605.090909-605.090909c13.963636-13.963636 13.963636-37.236364 0-51.2z" p-id="7885"></path></svg>
            </button>
            <button @click="saveScreenShot" title="保存">
                <svg t="1693918820464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17508" width="30" height="30"><path d="M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z" p-id="17509"></path></svg>
            </button>
            <button @click="withdraw" title="撤回">
                <svg t="1693921117699" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21985" width="30" height="30"><path d="M329.045333 137.685333a32 32 0 0 1 48.128 41.984l-2.858666 3.285334L215.893333 341.333333l158.421334 158.378667a32 32 0 0 1 2.858666 41.984l-2.858666 3.285333a32 32 0 0 1-41.984 2.858667l-3.285334-2.858667L148.053333 363.946667a32 32 0 0 1-2.858666-41.984l2.858666-3.242667 180.992-181.034667z" fill="#000000" p-id="21986"></path><path d="M640 309.333333a245.333333 245.333333 0 0 1 9.386667 490.496l-9.386667 0.170667H170.666667a32 32 0 0 1-4.352-63.701333L170.666667 736h469.333333a181.333333 181.333333 0 0 0 8.789333-362.453333L640 373.333333H170.666667a32 32 0 0 1-4.352-63.701333L170.666667 309.333333h469.333333z" fill="#000000" p-id="21987"></path></svg>
            </button>
        </div>
        <div :style="{
            position: 'absolute',
            left: startX +'px',
            top: endY + 45 + 'px',
            width: 220 + 'px',
            height: 30 + 'px',
        }">
            <button v-show="isSelect==='draw'" v-for="size in drawSizes" :id="'draw'+size" class="secondButton" @click="changeSize(size,'draw','drawSize')">
                {{ size }}px
            </button>
            <button v-show="isSelect==='clear'" v-for="size in clearSizes" :id="'clear'+size" class="secondButton" @click="changeSize(size,'clear','clearSize')">
                {{  size }}px
            </button>
            <button v-show="isSelect==='text'" v-for="size in textSizes" :id="'text'+size" class="secondButton" @click="changeSize(size,'text','textSize')">
                {{ size }}px
            </button>
            <button v-show="isSelect==='color'" v-for="color in colorList" :id="'color'+color" class="secondButton" :style="{backgroundColor:color,padding:10+'px'}" @click="changeSize(color,'color','colors')"></button>
            <input @input="getsizeOrColorInput" v-model="sizeOrColorInput" v-show="isSelect" type="text" style="width: 44px;height: 25px;">
        </div>
    </div>
</template>
  
<script>
import { ipcRenderer } from 'electron'
//canvas为截图画布，img显示截图
let canvas,ctx,img,drawCanvas,drawctx,textCanvas,textctx
const devicePixelRatio = window.devicePixelRatio
export default{
    data(){
        return{
            fullScreenWidth:0, //窗口大小
            fullScreenHeight:0,
            isShortsCut:false,//是否是快捷键打开的窗口
            isShowScreenShotCanvas:false,//绘制截图的画布
            isShowShade:true,//黑幕遮罩
            isShowDrawCanvas:false,//画笔的画布
            isShowClearCanvas:false,//橡皮擦
            /*
                与设置相关的数据
            */
            isShowFirstSetting:false, //一级设置
            isShowSecondSetting:false, //编辑截图设置
            /*
                与画布相关的数据
            */
            isDrawing:false, //画笔有无落下
            isClear:false,//橡皮擦有无落下
            isSelect:'', //当前的选择，画笔,橡皮擦等等
            clearX:0, // 橡皮擦位置
            clearY:0,
            drawSizes:[1,4,8,12], //画笔大小选择
            drawSize:8, //画笔大小
            clearSizes:[6,10,14,18], //橡皮擦大小选择
            clearSize:14,//橡皮擦大小
            textSizes:[10,14,16,20],//文字大小选择
            textSize:16,//文本大小
            colorList:['blue','black','red','yellow'],
            color:'red', //画笔和文字的颜色
            sizeOrColorInput:'',
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
            endY:0,
        }
    },
    methods:{
        createTextArea(e){
            let textarea = document.createElement('textarea')
            textarea.style.position = 'absolute'
            textarea.style.left = e.clientX + 'px'
            textarea.style.top = e.clientY + 'px'
            textarea.style.backgroundColor = 'transparent'
            textarea.style.border = 'none'
            textarea.style.overflow = 'hidden'
            textarea.style.resize = 'none'
            textarea.style.fontSize = this.textSize+'px'
            textarea.style.fontFamily = 'sans-serif'
            textarea.style.lineHeight = 1
            textarea.spellcheck = false
            textarea.addEventListener('input',(e)=>{
                let value = e.target.value,line = 1,reg = /\n/g,textarea = e.target,max = 0
                textctx.font = '${this.textSize}px sans-serif'       
                value.split(reg).forEach((v)=>{
                    let width = textctx.measureText(v).width
                    if(width>max) max = width
                })
                if(value.match(reg)) line += value.match(reg).length
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight+'px'
                textarea.style.width = max+'px'
            })
            textarea.addEventListener('blur',(e)=>{
                if(!e.target.value) e.target.remove()
            })
            document.body.appendChild(textarea)
        },//创建文本
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
        getTextScreenShotImage(arr){
            arr.forEach((textarea)=>{
                let size = textarea.style.fontSize
                ctx.font = `${size}px sans-serif`
                let text = textarea.value
                let {left,top} = textarea.getBoundingClientRect()
                let x = (left - this.startX)*devicePixelRatio
                let y = (top - this.startY)*devicePixelRatio
                ctx.fillText(text,x,y)
            })
        },//将文本写入截图
        //一级设置相关的函数

        editScreenShot(){
            this.isShowFirstSetting = false
            this.isShowSecondSetting = true
            this.stopMoveCutScreen = true //当进入编辑截图时截图框不能移动
        },//进入编辑截图
        async copyToclipboard(){
            this.getScreenShotImage()
            let textarea = document.querySelectorAll('textarea')
            if(textarea)this.getTextScreenShotImage(textarea)
            if(drawCanvas)await ctx.drawImage(drawCanvas,0,0,drawCanvas.width,drawCanvas.height)
            //将canvas变成blob对象，然后使用clipboard复制到剪切板中
            canvas.toBlob((blob)=>{
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(()=>{
                    this.closeScreenShot()
                }).catch((err)=>console.log(err))
            })          
        },//复制到剪切板
        async saveScreenShot(){
           this.getScreenShotImage()
           let textarea = document.querySelectorAll('textarea')
           if(textarea)this.getTextScreenShotImage(textarea)
           if(drawCanvas)await ctx.drawImage(drawCanvas,0,0,drawCanvas.width,drawCanvas.height)
           let url = canvas.toDataURL()
           ipcRenderer.send('openDialog','save',url)
        },//保存截图

        //二级设置相关的函数

        drawScreenShot(){
            if(this.isSelect&&this.isSelect!='color') document.getElementById(this.isSelect).style.backgroundColor='white'
            document.getElementById('draw').style.backgroundColor='rgba(137,207,240,0.9)'
            this.isShowDrawCanvas = true
            if(!drawctx){
                drawCanvas = document.getElementById('drawScreenShotCanvas')
                drawctx = drawCanvas.getContext('2d')
                drawCanvas.width = this.width*devicePixelRatio
                drawCanvas.height = this.height*devicePixelRatio
            }
            document.getElementById('draw'+this.drawSize).style.backgroundColor='rgba(137,207,240,0.9)'
            this.sizeOrColorInput = this.drawSize
            this.isSelect = 'draw'
        },//绘制截图
        clearScreenShot(){
            if(this.isSelect&&this.isSelect!='color') document.getElementById(this.isSelect).style.backgroundColor='white'
            document.getElementById('clear').style.backgroundColor='rgba(137,207,240,0.9)'
            this.isSelect = 'clear'
            this.sizeOrColorInput = this.clearSize
            document.getElementById('clear'+this.clearSize).style.backgroundColor='rgba(137,207,240,0.9)' 
            this.isShowClearCanvas = true
        },//橡皮擦
        textScreenShot(){
            if(this.isSelect&&this.isSelect!='color') document.getElementById(this.isSelect).style.backgroundColor='white'
            document.getElementById('text').style.backgroundColor='rgba(137,207,240,0.9)'
            this.isSelect = 'text'
            this.sizeOrColorInput = this.textSize
            document.getElementById('text'+this.textSize).style.backgroundColor='rgba(137,207,240,0.9)'
            if(!textctx){
                textCanvas = document.getElementById('textCanvas')
                textctx = textCanvas.getContext('2d')   
            }
        },//文本
        colorScreenShot(){
            if(this.isSelect&&this.isSelect!='color') document.getElementById(this.isSelect).style.backgroundColor='white'
            this.isSelect = 'color'
        },
        getsizeOrColorInput(e){
            let inputList = e.target.value.match(/[0-9]/g),input = ''
            if(inputList){
                for(let i=0;i<inputList.length;i++){
                    input += inputList[i]
                }
                input = Number(input)
            }else{
                input = 1
            }
            if(input&&this.isSelect==='draw'){
                input = Math.max(1,input)
                input = Math.min(30,input)
                this.drawSizes.forEach((value)=>{
                    if(value===input){
                        document.getElementById('draw'+input).style.backgroundColor='rgba(137,207,240,0.9)'  
                    }else{
                        document.getElementById('draw'+value).style.backgroundColor='white'  
                    }
                })
                this.drawSize = input
            }else if(input&&this.isSelect==='clear'){
                input = Math.max(1,input)
                input = Math.min(120,input)
                this.clearSizes.forEach((value)=>{
                    if(value===input){
                        document.getElementById('clear'+input).style.backgroundColor='rgba(137,207,240,0.9)'  
                    }else{
                        document.getElementById('clear'+value).style.backgroundColor='white' 
                    }
                })
                this.clearSize = input
            }else if(input&&this.isSelect==='text'){
                input = Math.max(1,input)
                input = Math.min(30,input)
                this.textSizes.forEach((value)=>{
                    if(value===input){
                        document.getElementById('text'+input).style.backgroundColor='rgba(137,207,240,0.9)'  
                    }else{
                        document.getElementById('text'+value).style.backgroundColor='white'
                    }
                })
                this.textSize = input
            }else if(this.isSelect==='color'){

            }
            this.sizeOrColorInput = input
        },  
        changeSize(size,type,types){
            if(this.isSelect&&this.isSelect!=this.color){
                document.getElementById(type+this[types]).style.backgroundColor = 'white'
                document.getElementById(type+size).style.backgroundColor = 'rgba(137,207,240,0.9)'
                this.sizeOrColorInput = size
            }
            this[types] = size
        },
        withdraw(){
            if(this.isSelect&&this.isSelect!='color') document.getElementById(this.isSelect).style.backgroundColor='white'
            this.isSelect = ''
            this.isShowFirstSetting = true
            this.isShowSecondSetting = false
        },//撤回

        //画布移动相关的函数

        startMoveOnCanvas(e){
            if(this.isSelect==='draw'){
                if(this.isDrawing) return
                this.isDrawing = true
                drawctx.lineWidth = this.drawSize
                drawctx.strokeStyle = this.color
                drawctx.beginPath()
                drawctx.moveTo(e.offsetX*devicePixelRatio,e.offsetY*devicePixelRatio)
            }else if(this.isSelect==='clear'){
                if(this.isClear) return
                this.isClear = true
            }
        },
        MoveOnCanvas(e){
            if(this.isSelect==='draw'){
                if(!this.isDrawing) return
                drawctx.lineTo(e.offsetX*devicePixelRatio,e.offsetY*devicePixelRatio)
                drawctx.stroke()
            }else if(this.isSelect==='clear'){
                if(!this.isClear||!drawctx) return
                let x = (this.clearX - this.startX-(this.clearSize/2))*devicePixelRatio
                let y = (this.clearY - this.startY-(this.clearSize/2))*devicePixelRatio
                drawctx.clearRect(x,y,this.clearSize,this.clearSize)
            }
        },
        stopMoveOnCanvas(e){
            if(this.isSelect==='draw'){
                if(!this.isDrawing) return
                this.isDrawing = false
                drawctx.closePath()
            }else if(this.isSelect==='clear'){
                if(!this.isClear) return
                this.isClear = false
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
            if(this.isSelect==='text') this.createTextArea(e)
            if(this.isSelect==='draw'||this.isSelect==='clear') this.startMoveOnCanvas(e)
            if(this.moveShowCutScreen||this.stopMoveCutScreen) return
            this.moveShowCutScreen = true
            this.moveX = e.clientX - this.startX
            this.moveY = e.clientY - this.startY
        },
        movePostion(e){
            if(this.isSelect==='clear'){
                this.clearX = e.clientX
                this.clearY = e.clientY
            }
            if(this.isSelect==='draw'||this.isSelect==='clear') this.MoveOnCanvas(e)
            if(!this.moveShowCutScreen||this.stopMoveCutScreen) return
            this.startX = Math.max((e.clientX - this.moveX),0) 
            this.startY = Math.max((e.clientY - this.moveY),0) 
            if(this.startX+this.width>this.fullScreenWidth){
               this.endX = this.fullScreenWidth 
               this.startX = this.endX - this.width
            }else{
                this.endX = this.startX + this.width
            }
            if(this.startY+this.height>this.fullScreenHeight){
                this.endY = this.fullScreenHeight
                this.startY = this.endY - this.height
            }else{
                this.endY = this.startY + this.height
            }
        },
        moveEndPostion(){
            if(this.isSelect==='draw'||this.isSelect==='clear') this.stopMoveOnCanvas()
            if(!this.moveShowCutScreen||this.stopMoveCutScreen) return
            this.moveShowCutScreen = false
        }
    },
    mounted(){
        ipcRenderer.send('getFullScreen')
        ipcRenderer.on('sendFullScreen', async(event,image,size) => { 
            const {width,height} = size
            this.fullScreenWidth = width 
            this.fullScreenHeight = height 
            img = document.querySelector('img')
            img.src = image 
        })
        ipcRenderer.on('isShortsCut',(e,message)=>{
            this.isShortsCut = message
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
  .secondButton{
    width: 40px;
    height: 30px;
    margin: 1px;
  }
  </style>