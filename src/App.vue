<template>
  <div id="app">
    <vtree :navs="navs"
           :pList="list"
           @changeDepart="toChangedepart"
           @toLowerLevel="toLowerLevel"
           @getDataById="getDataById">
    </vtree>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      navs: [
        {
          name: '山东移动',
          id: 1
        },
        {
          name: '济南营业部',
          id: 12
        },
        {
          name: '滨洲营业部',
          id: 123
        }
      ],
      list: {
        orgList: [
          {
            name: '滨洲县',
            id: 1231,
            count: 2
          },
          {
            name: '滨洲县2',
            id: 1232,
            count: 4
          }
        ],
        userList: [
          {
            name: '邓勇',
            userId: '1233'
          }
        ]
      }
    }
  },
  methods: {
    toChangedepart(index) {
      this.navs = this.navs.slice(0, index + 1)
    },
    toLowerLevel(depart) {
      this.navs.push({
        id: depart.id,
        name: depart.name
      })
    },
    getDataById(id) {
      this.list = {
        orgList: [
          {
            name: '济南县',
            id: 121,
            count: 0
          },
          {
            name: '滨洲县2',
            id: 122,
            count: 5
          },
          {
            name: '滨洲营业部',
            id: 123,
            count: 6
          }
        ],
        userList: [
          {
            name: 'aoliao',
            userId: '124'
          }
        ]
      }
    }
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
