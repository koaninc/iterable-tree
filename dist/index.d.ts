declare type NodeId = string;
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
    private byParentId;
    /**
     *  Helper: creates a new `Tree` from a set of nodes.
     */
    static from<T extends Node = Node>(ts: T[]): Tree<T>;
    constructor(ts?: T[]);
    /** Add a new element to the tree */
    add(t: T): void;
    /**
     *  Produce a copy of this tree without the node `id` or its descendants
     */
    without(id: NodeId): Tree<T>;
    /**
     *  Retrieve a list of nodes descended from the node `id`
     */
    descendantsOf(id: NodeId): T[];
    /**
     *  Test whether the node `id` is descended from the node `ancestorId`
     */
    isAncestorOf(id: NodeId, ancestorId: NodeId): boolean;
    /**
     *  Retrieve all ancestors of the node `id`
     */
    ancestorsOf(id: NodeId): T[];
    /**
     *  Retrieve all parent-less (i.e., root) nodes
     */
    roots(): T[];
    /**
     *  Project this tree as a flat array
     */
    flat(): T[];
}
export declare const from: typeof Tree.from;
export {};
