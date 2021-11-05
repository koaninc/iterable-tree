"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  `Tree` provides access to tree-like data
 */
class Tree extends Map {
    constructor(ts = []) {
        super();
        // Prevent JS/runtime enumeration of an (otherwise-private) member
        Object.defineProperty(this, 'byParentId', {
            value: new Map(),
        });
        for (const t of ts) {
            this.add(t);
        }
    }
    /**
     *  Helper: creates a new `Tree` from a set of nodes.
     */
    static from(ts) {
        return new Tree(ts);
    }
    /** Add a new element to the tree */
    add(t) {
        var _a;
        super.set(t.id, t);
        if (!t.parentId) {
            return;
        }
        const childIds = (_a = this.byParentId.get(t.parentId)) !== null && _a !== void 0 ? _a : new Set();
        childIds.add(t.id);
        this.byParentId.set(t.parentId, childIds);
    }
    /**
     *  Produce a copy of this tree without the node `id` or its descendants
     */
    without(id) {
        const omitIds = [id].concat(this.descendantsOf(id).map((n) => n.id));
        const nodes = new Set();
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
    descendantsOf(id) {
        const result = [];
        const childIds = this.byParentId.get(id);
        if (!childIds) {
            return result;
        }
        for (const id of childIds) {
            const child = this.get(id);
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
    isAncestorOf(id, ancestorId) {
        if (id === ancestorId) {
            return false;
        }
        let n = this.get(id);
        while (n) {
            if (n.id === ancestorId) {
                return true;
            }
            else if (!n.parentId) {
                return false;
            }
            n = this.get(n.parentId);
        }
        return false;
    }
    /**
     *  Retrieve all ancestors of the node `id`
     */
    ancestorsOf(id) {
        const result = [];
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
    roots() {
        const result = [];
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
    flat() {
        const result = [];
        for (const [, n] of this) {
            result.push(n);
        }
        return result;
    }
}
exports.default = Tree;
//# sourceMappingURL=index.js.map