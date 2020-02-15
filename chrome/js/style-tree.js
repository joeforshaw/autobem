class StyleTree {
  constructor(html, block) {
    this.root = new StyleTreeNode(html, null);
    this.root.calculateStyles();
    this.block = block;
    this.tree = this.root;
    this.list = [];
    this.excludedTags = ["head", "script", "noscript", "style", "iframe", "embed"];
    this.buildNodeTree(this.tree, false);
  }

  buildNodeTree(node, insideBlock) {
    var self = this;
    var isBlock = node.element === this.block;
    if (isBlock) {
      insideBlock = true;
      self.list.push(node);
    }

    var children = Array.prototype.slice.call(node.element.children);
    children.forEach(function(child) {
      var childNode = new StyleTreeNode(child, node)
      if (self.shouldExcludeTag(childNode.tag)) {
        return;
      }
      childNode.calculateStyles();
      node.children.push(childNode);
      if (insideBlock) {
        self.list.push(childNode);
      }
      self.buildNodeTree(childNode, insideBlock);
    });
  }

  shouldExcludeTag(tag) {
    return this.excludedTags.includes(tag);
  }
}
