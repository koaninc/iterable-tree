# iterable-tree

Implements an [iterable][mdn-iterable] tree with associated helpers.

## Creating a tree

A tree consists of `Node`s with a unique `id` field and an (optional) `parentId`
reference.

```js
const Tree = require('iterable-tree');

const tree = Tree.from([
  { id: 'root' },
  { id: 'child-a', parentId: 'root' },

  // Multiple root (parent-less) nodes are supported
  { id: 'root-2' },
]);
```

## Iteration

Iterate over the tree's nodes as if it were a [`Map`][mdn-map]:

```js
const ids = [];

for (const [nodeId, node] of tree) {
  ids.push(node.id.toUpperCase());
}

console.log(ids); // ['ROOT', 'CHILD-A']
```

## Helpers

### `.add(node)`

Adds a new element to the tree

### `.without(ancestorNodeId)`

Returns a copy of the tree with the node and any descendants removed

### `.descendantsOf(ancestorNodeId)`

Returns an array containing the specified ancestor's descendants

### `.isAncestorOf(nodeId, ancestorId)`

Returns true if the node is descended from the specified ancestor

### `.ancestorsOf(nodeId)`

Returns all ancestors of the specified node

### `.roots()`

Returns an array containing all "root" nodes

### `.flat()`

Projects the tree into an array

# License

ISC

[mdn-iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[mdn-map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

