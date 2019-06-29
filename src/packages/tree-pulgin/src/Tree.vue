<template>
  <div id="Tree">
    <nav>
      <ul>
        <li>山东移动</li>
        <li>济南营业部</li>
        <li>滨县营业部</li>
      </ul>
    </nav>
    <div class="wrapper">
      <div class="tree__item" v-for="(item, i) in list" :key="i">
        <div class="item__left" @click="toggleStatus(item)">
          <span class="item__left__btn" :class="getStatus(item)"></span>
          <h4 class="item__left__name">{{item.name}}</h4>
        </div>
        <div class="item__right" v-if="item.hasOwnProperty('children')">
          <p class="item__right__count">{{item.count}}</p>
          <span class="item__right__arrow"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Organ from './organization'

export default {
  name: 'Tree',
  data() {
    return {
      navs: [
        {
          name: '山东移动',
          id: 1
        },
        {
          name: '滨洲',
          id: 12
        }
      ],
      orgList: [
        {
          name: '滨洲县',
          id: 123,
          count: 2
        },
        {
          name: '滨洲县2',
          id: 124,
          count: 4
        }
      ],
      userList: [
        {
          name: '邓勇',
          userId: '1234567'
        }
      ],
      list: null,
      organ: null
    }
  },
  async created() {
    this.organ = new Organ(this.navs, this.orgList, this.userList)
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
