<template>
  <div id="Tree">
    <nav>
      <ul>
        <li v-for="(item,i) in navs" :key="i" @click="changeDepart(item.id, i)">{{item.name}}</li>
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
      organ: null,
      selectedDepart: [],
      selectedStuff: []
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
      this.handleSelected(item)
    },
    // 导航切换部门
    changeDepart(id, i) {
      let list = this.organ.getDisplayList(id)
      if (!list) {
        this.$emit('getDataById', id)
      } else {
        this.list = list
      }
      this.$emit('changeDepart', i)
    },
    // 到下一层级
    toLowerLevel(depart) {
      if (depart.init) {
        this.list = depart.children
      } else {
        this.organ.findDepart = depart
        this.$emit('getDataById', depart.id)
      }
      this.$emit('toLowerLevel', depart)
    },
    handleSelected(item) {
      if (item instanceof Department) {
        if (item.status === 2) {
          this.saveSelected(item, 'Depart')
        } else {
          this.cancelSelected(item, 'Depart')
        }
      } else {
        if (item.status) {
          this.saveSelected(item, 'Stuff')
        } else {
          this.cancelSelected(item, 'Stuff')
        }
      }
    },
    // 保存选择
    saveSelected(item, type) {
      this[`selected${type}`].push(item)
    },
    // 取消选择
    cancelSelected(item, type) {
      let index = this[`selected${type}`].findIndex((value) => value.id === item.id)
      if (index > -1) {
        this[`selected${type}`].splice(index, 1)
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
          let _depart = new Department({
            id: depart.id,
            name: depart.name,
            count: depart.count
          }, currentDepart.sObserver)
          _depart.setStatus(currentDepart.status)
          currentDepart.addChild(_depart)
        }
      })
      newVal.userList.forEach(stuff => {
        let _stuff = new Stuff({
          id: stuff.userId,
          name: stuff.name
        }, currentDepart.sObserver)
        _stuff.setStatus(currentDepart.status)
        currentDepart.addChild(_stuff)
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
