<template>
  <div id="app">
    <v-tree />
  </div>
</template>

<script>
import VTree from '@/packages/tree-pulgin/src/Tree'

export default {
  name: 'app',
  components: {
    VTree
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
