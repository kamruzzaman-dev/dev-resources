const normalize = require('../normalize-strings')

function sortArray(node) {
    node.forEach(({ children }) => {
        if (children.length > 0) {
            sortArray(children)
        }
    })

    return node.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
}

module.exports = function (metadata) {
    const result = []

    for (const item of metadata) {
        for (const category of item.categories) {
            const parents = category.split('/').reverse()

            const ids = []
            let children = result

            for (i = 0; parents.length > 0; i++) {
                const parent = parents.pop()
                let foundParent = false

                ids.push(normalize.slug(parent))

                for (const child of children) {
                    if (child.name === parent) {
                        children = child.children
                        foundParent = true
                        break
                    }
                }

                if (!foundParent) {
                    const data = metadata.filter((item) => item.categories.includes(category))

                    const newChild = { name: parent, id: ids.join('-'), data, depth: i, children: [] }
                    children.push(newChild)
                    children = newChild.children
                }
            }
        }
    }

    return sortArray(result)
}
