import Queue from "./queueStructure";
function Node(data) {
  this.data = data;
  this.parent = null;
  this.children = [];
}

class Tree {
  constructor(data = {}) {
    this._root = new Node(data);
  }

  traverseDF(callback) {
    (function recurse(currentNode) {
      for (let i = 0, length = currentNode.children.length; i < length; i++) {
        recurse(currentNode.children[i]);
      }

      callback(currentNode);
    })(this._root);
  }

  traverseBF(callback) {
    let queue = new Queue();
    queue.enqueue(this._root);
    let currentTree = queue.dequeue();
    while (currentTree) {
      for (let i = 0, length = currentTree.children.length; i < length; i++) {
        queue.enqueue(currentTree.children[i]);
      }

      callback(currentTree);
      currentTree = queue.dequeue();
    }
  }

  contains(callback, traversal) {
    traversal.call(this, callback);
  }

  findById(id) {
    let isFind = false;
    this.traverseBF((parent) => {
      if (isFind) return;
      if (parent.data.id === id) {
        isFind = parent;
        return;
      }
    });
    return isFind;
  }

  add(data, toData, traversal) {
    let child = new Node(data);
    let parent = null;
    const callback = function (node) {
      if (node.data === toData) {
        parent = node;
      }
    };
    if (!traversal) {
      this.contains(callback, this.traverseBF);
    } else {
      this.contains(callback, traversal);
    }

    if (parent) {
      parent.children.push(child);
      child.parent = parent;
    } else {
      throw new Error("Cannot add node to a non-existent parent.");
    }
  }
}

export default Tree;
