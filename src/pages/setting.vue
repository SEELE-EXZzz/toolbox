<template>
    <div id="app">
        <div id="leftSide">
            <ul>
                <li><router-link to="/setting/shortsCut" active-class="active">快捷键设置</router-link></li>
                <li><router-link to="/setting/show" active-class="active">显示设置</router-link></li>
            </ul>
        </div>
        <div id="rightSide">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

export default{

}

</script>

<style scoped>
#leftSide{
    position: absolute;
    left: 5%;
    top: 10%;
    width: 25%;
    height: 60%;
}
#rightSide{
    position: absolute;
    left: 35%;
    top: 10%;
    width: 60%;
    height: 80%;
}
a {
  text-decoration: none; 
  color: inherit; 
}
ul {
  list-style: none; 
  padding: 0; 
  margin: 0; 
}
li{
    font-size: 24px;
    text-align: center;
    height: 10%;
    width: 100%;
    margin-bottom: 10px;
}
.active{
    background-color: rgba(137,207,240,0.5);
}
</style>