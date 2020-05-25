<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import Login from './components/Login'
// import Home from './components/Home'
export default {
    components:{
      Login,
      Home:()=>import('./components/Home')
    }
}
</script>
<style lang="less">


</style>
