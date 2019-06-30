import Tree from './src/Tree'

Tree.install = function(Vue) {
	if (Vue.installed) return
	Vue.component(Tree.name, Tree)
}

export default Tree
