import Tree from './src/Tree'

Tree.install = function(Vue) {
	if (install.installed) return
	Vue.components(Tree.name, Tree)
}

export default Tree
