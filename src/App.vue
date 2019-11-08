<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
#app {
}
.el-table--border::after, .el-table--group::after, .el-table::before{
      background-color:rgba(0,0,0,0)!important;
}
body{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body, div, p, ul, li, h4{
  margin: 0;
  padding: 0;
}
.el-submenu__title{
    color: aqua;
    border-left: 7px solid #FFF;
}
.ql-snow .ql-picker-label {
    display: flex !important;
}
.el-table{
  overflow: auto !important;
}
.list{
  min-width: 1300px;
}
.el-table .cell{
  text-align: center !important; 
}
</style>
