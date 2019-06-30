<template>
  <div id="Tree">
    <nav>
      <ul>
        <li v-for="(item,i) in navs" :key="i" @click="changeDepart(item.id)">{{item.name}}</li>
      </ul>
    </nav>
    <div class="wrapper">
      <div class="tree__item" v-for="(item, i) in list" :key="i">
        <div class="item__left" @click="toggleStatus(item)">
          <span class="item__left__btn" :class="getStatus(item)"></span>
          <h4 class="item__left__name">{{item.name}}</h4>
        </div>
        <div class="item__right" v-if="item.hasOwnProperty('children')" @click="toLowerLevel(item)">
          <p class="item__right__count">{{item.count}}</p>
          <span class="item__right__arrow"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Organ, Department, Stuff } from './organization'

export default {
  name: 'vtree',
  props: {
    navs: {
      type: Array,
      default: () => []
    },
    pList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: null,
      organ: null
    }
  },
  async created() {
    this.organ = new Organ(this.navs, this.pList.orgList, this.pList.userList)
    try {
      this.list = await this.organ.getDisplayList(
        this.navs[this.navs.length - 1].id
      )
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    toggleStatus(item) {
      item.toggleStatus()
    },
    // 导航切换部门
    changeDepart(id) {
      let list = this.organ.getDisplayList(id)
      if (!list) {
        this.$emit('getDataById', id)
      } else {
        this.list = list
      }
    },
    // 到下一层级
    toLowerLevel(depart) {
      if (depart.init) {
        this.list = depart.children
      } else {
        this.organ.findDepart = depart
        this.$emit('getDataById', depart.id)
      }
    },
    getStatus(item) {
      let className = ''
      if (item.hasOwnProperty('children')) {
        switch (item.status) {
          case 1:
            className = 'half'
            break
          case 2:
            className = 'all'
            break
        }
      } else {
        if (item.status) {
          className = 'all'
        }
      }
      return className
    }
  },
  watch: {
    pList(newVal) {
      let currentDepart = this.organ.findDepart
      let orignalData = currentDepart.children[0]
      newVal.orgList.forEach(depart => {
        if (orignalData && orignalData.id === depart.id) {
          orignalData.count = depart.count
        } else {
          currentDepart.addChild(new Department({
            id: depart.id,
            name: depart.name,
            count: depart.count
          }, currentDepart.sObserver))
        }
      })
      newVal.userList.forEach(stuff => {
        currentDepart.addChild(new Stuff({
          id: stuff.userId,
          name: stuff.name
        }, currentDepart.sObserver))
      })
      currentDepart.initOk()
      this.list = currentDepart.children
    }
  }
}
</script>

<style lang="less">
#Tree {
  nav {
    ul {
      margin-bottom: 6px;
      padding: 6px 10px;
      font-size: 14px;
      text-align: left;
      list-style: none;
      li {
        display: inline;
        cursor: pointer;
        &:not(:last-child)::after {
          content: ">";
          padding: 0 4px;
        }
      }
    }
  }
  .wrapper {
    .tree__item {
      padding: 6px 10px;
      &::after {
        content: "";
        display: table;
        clear: both;
      }
      .item__left {
        float: left;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .item__left__btn {
          display: inline-block;
          margin-right: 4px;
          width: 14px;
          height: 14px;
          background: url("../images/select_default.png") no-repeat 0 0;
          background-size: 14px 14px;
          &.half {
            background: url("../images/half_select.png") no-repeat 0 0;
            background-size: 14px 14px;
          }
          &.all {
            background: url("../images/all_select.png") no-repeat 0 0;
            background-size: 14px 14px;
          }
        }
        .item__left__name {
          font-size: 14px;
          line-height: 20px;
          font-weight: normal;
        }
      }
      .item__right {
        float: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .item__right__count {
          font-size: 14px;
          line-height: 20px;
        }
        .item__right__arrow {
          display: inline-block;
          margin-left: 4px;
          width: 14px;
          height: 14px;
          background: url("../images/arrow_right.png") no-repeat 0 0;
          background-size: 14px 14px;
        }
      }
    }
  }
}
</style>
