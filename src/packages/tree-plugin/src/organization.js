/* navs = [
  {
    name: '山东移动'
    id: 1
  },
  {
    name: '滨洲',
    id: 12
  }
]

currentDepart = {
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
  ]
} */

class Observer {
  constructor () {
    this.message = {}
  }

  onEvent (eventName, fn) {
    if (!this.message[eventName]) {
      this.message[eventName] = [fn]
    } else {
      this.message[eventName].push(fn)
    }
  }

  emitEvent (eventName, args) {
    if (!this.message[eventName]) {
      return
    }
    let i = 0
    let len = this.message[eventName].length

    for (; i < len; i++) {
      this.message[eventName][i].call(this, args)
    }
  }
  removeEvent (eventName, fn) {
    if (!this.message[eventName]) {
      return
    }
    if (fn) {
      let len = this.message[eventName].length
      let i = 0
      for (; i < len; i++) {
        this.message[eventName][i] === fn && this.message[eventName].splice(i, 1)
      }
    } else {
      delete this.message[eventName]
    }
  }
}

export class Stuff {
  constructor ({ id, name }, pObserver) {
    this.id = id
    this.name = name
    this.status = false
    this.pObserver = pObserver
    this.initEvent()
  }

  initEvent () {
    this.pObserver.onEvent('changeChild', (flag) => {
      if (flag === 2) {
        this.status = true
      } else {
        this.status = false
      }
    })
  }
  toggleStatus() {
    this.status = !this.status
    this.pObserver.emitEvent('changeParent')
  }
}

export class Department {
  constructor ({ id, name, count }, pObserver) {
    this.id = id
    this.name = name
    // 0不选,1半选,2全选
    this.status = 0
    // 部门人数
    this.count = count
    // 子类
    this.children = []
    // 判断是否已齐全数据
    this.init = false
    this.sObserver = new Observer()
    this.pObserver = pObserver || null
    this.initEvent()
  }
  initEvent () {
    this.sObserver.onEvent('changeParent', () => {
      this.juggleStatus()
      this.pObserver && this.pObserver.emitEvent('changeParent')
    })
    if (this.pObserver) {
      this.pObserver.onEvent('changeChild', (flag) => {
        this.status = flag
        this.sObserver.emitEvent('changeChild', this.status)
      })
    }
  }
  // 添加子节点
  addChild(child) {
    this.children.push(child)
  }
  initOk() {
    this.init = true
  }
  // 判断自身状态
  juggleStatus() {
    let count = 0
    let len = this.children.length
    let i = 0
    for (; i < len; i++) {
      let child = this.children[i]
      if (child instanceof Department) {
        if (child.status === 2) {
          count++
        } else if (child.status === 1) {
          this.status = 1
          return
        }
      } else {
        child.status && count++
      }
    }

    if (count > 0) {
      if (count === len) {
        this.status = 2
      } else {
        this.status = 1
      }
    } else {
      this.status = 0
    }
  }
  toggleStatus() {
    if (this.status === 2) {
      this.status = 0
    } else {
      this.status = 2
    }
    this.sObserver.emitEvent('changeChild', this.status)
    this.pObserver && this.pObserver.emitEvent('changeParent')
  }
}

export class Organ {
  constructor (navs, departs, stuffs) {
    this.organization = null
    this.findDepart = null
    this.init(navs, departs, stuffs)
  }
  init (navs, departs, stuffs) {
    let temp = null
    let i = 0
    let len = navs.length
    for (; i < len; i++) {
      let depart = null
      if (i === 0) {
        this.organization = temp = new Department({
          id: navs[i].id,
          name: navs[i].name,
          count: navs[i].count
        })
      } else {
        depart = new Department({
          id: navs[i].id,
          name: navs[i].name,
          count: navs[i].count
        }, temp.sObserver)
        temp.addChild(depart)
        temp = depart
      }
    }

    departs.forEach(depart => {
      temp.addChild(new Department({
        id: depart.id,
        name: depart.name,
        count: depart.count
      }, temp.sObserver))
    })
    stuffs.forEach(stuff => {
      temp.addChild(new Stuff({
        id: stuff.userId,
        name: stuff.name
      }, temp.sObserver))
    })
    temp.initOk()
  }
  // 获取展示数据列表
  getDisplayList(id) {
    this.getDepartById(id)
    if (this.findDepart) {
      if (this.findDepart.init) {
        return this.findDepart.children
      } else {
        // 请求数据
        return null
      }
    } else {
      console.log('查找id有误')
    }
  }
  getDepartById(id) {
    this._clearFindDepart()
    this.deepFind(this.organization.children, id)
  }
  deepFind(list, id) {
    if (this.findDepart) {
      return
    }
    let len = list.length
    let i = 0
    for (; i < len; i++) {
      if (list[i] instanceof Department) {
        if (list[i].id === id) {
          this.findDepart = list[i]
          break
        } else {
          this.deepFind(list[i].children, id)
        }
      }
    }
  }
  _clearFindDepart() {
    this.findDepart = null
  }
}
