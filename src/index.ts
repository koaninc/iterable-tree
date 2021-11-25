type NodeId = string;

/**
 *  A Node in a tree
 */
export interface Node {
  id: NodeId;
  parentId?: NodeId;
}

/**
 *  `Tree` provides access to tree-like data
 */
export default class Tree<T extends Node> extends Map<NodeId, T> {
  // @ts-ignore, since `tsc` doesn't know that we'll define it at runtime
  private byParentId: Map<NodeId, Set<NodeId>>;

  /**
   *  Helper: creates a new `Tree` from a set of nodes.
   */
  static from<T extends Node = Node>(ts: T[]): Tree<T> {
    return new Tree(ts);
  }

  public constructor(ts: T[] = []) {
    super();

    // Prevent JS/runtime enumeration of an (otherwise-private) member
    Object.defineProperty(this, 'byParentId', {
      value: new Map<NodeId, Set<NodeId>>(),
    });

    for (const t of ts) {
      this.add(t);
    }
  }

  /** Add a new element to the tree */
  public add(t: T) {
    super.set(t.id, t);

    if (!t.parentId) {
      return;
    }

    const childIds = this.byParentId.get(t.parentId) ?? new Set<NodeId>();
    childIds.add(t.id);
    this.byParentId.set(t.parentId, childIds);
  }

  /**
   *  Produce a copy of this tree without the node `id` or its descendants
   */
  public without(id: NodeId): Tree<T> {
    const omitIds = [id].concat(this.descendantsOf(id).map((n) => n.id));

    const nodes = new Set<T>();

    for (const [i, n] of this) {
      if (!omitIds.includes(i)) {
        nodes.add(n);
      }
    }

    return new Tree(Array.from(nodes));
  }

  /**
   *  Retrieve a list of nodes descended from the node `id`
   */
  public descendantsOf(id: NodeId): T[] {
    const result: T[] = [];

    const childIds = this.byParentId.get(id);
    if (!childIds) {
      return result;
    }

    for (const id of childIds) {
      const child = this.get(id)!;
      result.push(child);
      const ids = this.byParentId.get(child.id);
      if (ids) {
        for (const id of ids) {
          childIds.add(id);
        }
      }
    }

    return result;
  }

  /**
   *  Test whether the node `id` is descended from the node `ancestorId`
   */
  public isAncestorOf(id: NodeId, ancestorId: NodeId): boolean {
    if (id === ancestorId) {
      return false;
    }

    let n = this.get(id);
    while (n) {
      if (n.id === ancestorId) {
        return true;
      } else if (!n.parentId) {
        return false;
      }

      n = this.get(n.parentId);
    }

    return false;
  }

  /**
   *  Retrieve all ancestors of the node `id`
   */
  public ancestorsOf(id: NodeId): T[] {
    const result: T[] = [];

    let n = this.get(id);
    if (!n) {
      return result;
    }

    while (n.parentId) {
      n = this.get(n.parentId);
      if (!n) {
        break;
      }

      result.push(n);
    }

    return result;
  }

  /**
   *  Retrieve all parent-less (i.e., root) nodes
   */
  public roots(): T[] {
    const result: T[] = [];
    for (const [, n] of this) {
      if (!n.parentId) {
        result.push(n);
      }
    }
    return result;
  }

  /**
   *  Project this tree as a flat array
   */
  public flat(): T[] {
    const result: T[] = [];
    for (const [, n] of this) {
      result.push(n);
    }
    return result;
  }
}

/**
 *  Alias of `Tree.from`, exported for CommonJS convenience
 */
export const from = Tree.from;
