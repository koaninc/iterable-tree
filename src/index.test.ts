import assert from 'assert';
import Tree from './index';

const FIXTURES = {
  SIMPLE: [
    { id: 'root' },
    { id: 'root-2' },
    { id: 'child-a', parentId: 'root' },
    { id: 'child-a-1', parentId: 'child-a' },
    { id: 'child-a-2', parentId: 'child-a' },
    { id: 'child-b', parentId: 'root' },
  ],
};

const TESTS = {
  test_iterate() {
    const expected = [
      'ROOT',
      'ROOT-2',
      'CHILD-A',
      'CHILD-A-1',
      'CHILD-A-2',
      'CHILD-B',
    ];

    const tree = Tree.from(FIXTURES.SIMPLE);

    const ids = [];

    for (const [nodeId, node] of tree) {
      assert.equal(nodeId, node.id);
      ids.push(node.id.toUpperCase());
    }

    assert.deepEqual(expected, ids);
  },

  test_isAncestorOf() {
    const tree = Tree.from(FIXTURES.SIMPLE);

    assert.equal(false, tree.isAncestorOf('root', 'root'));
    assert.equal(false, tree.isAncestorOf('child-a', 'child-a'));
    assert.equal(false, tree.isAncestorOf('root', 'child-a'));
    assert.equal(true, tree.isAncestorOf('child-a', 'root'));
  },

  test_ancestorsOf() {
    const tree = Tree.from(FIXTURES.SIMPLE);

    assert.deepEqual(
      [tree.get('child-a'), tree.get('root')],
      tree.ancestorsOf('child-a-1'),
    );
  },

  test_descendantsOf() {
    const tree = Tree.from(FIXTURES.SIMPLE);

    assert.deepEqual(
      [
        tree.get('child-a'),
        tree.get('child-b'),
        tree.get('child-a-1'),
        tree.get('child-a-2'),
      ],
      tree.descendantsOf('root'),
    );
  },

  test_without() {
    const tree = Tree.from(FIXTURES.SIMPLE);

    assert.deepEqual(Tree.from([tree.get('root-2')!]), tree.without('root'));

    assert.deepEqual(
      [tree.get('root')!, tree.get('root-2')!, tree.get('child-b')!],
      tree.without('child-a').flat(),
    );
  },

  test_roots() {
    const tree = Tree.from(FIXTURES.SIMPLE);

    assert.deepEqual([tree.get('root')!, tree.get('root-2')!], tree.roots());
  },
};

const errors: [string, Error][] = [];
const skipped: string[] = [];

Object.entries(TESTS).forEach(function ([name, impl]) {
  if (name[0] === '_') {
    skipped.push(name);
    return;
  }

  try {
    impl();
  } catch (e) {
    errors.push([name, e as Error]);
    console.log(name, 'failed with error', e);
  }
});

if (errors.length > 0) {
  console.log('Failed with', errors.length, 'error(s)');
  process.exit(1);
}

if (skipped.length > 0) {
  console.log('Skipped', skipped.length, 'tests:\n -', skipped.join('\n - '));
}
