class StyleTreeNode {
  constructor(element, parent) {
    this.parent = parent;
    this.element = element;
    this.tag = element.tagName.toLowerCase();
    this.id = element.id || null;
    this.classes = element.classList.value || null;
    this.name = element.name || null;
    this.children = [];
    this.element.matches =
      this.element.matches ||
      this.element.webkitMatchesSelector ||
      this.element.mozMatchesSelector ||
      this.element.msMatchesSelector ||
      this.element.oMatchesSelector;
    this.description = null;
  }

  calculateStyles() {
    this.styles = new StylesCalculator(this).run();
  }

  defaultDescription(nodes) {
    return (
      this.description ||
      this.matchingElementDescription(nodes) ||
      this.name ||
      this.id ||
      ""
    );
  }

  matchingElementDescription(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var matches =
        node.description &&
        node.tag === this.tag &&
        node.classes === this.classes &&
        node.id === this.id;
      if (matches) {
        return node.description;
      }
    }
    return null;
  }

  formattedDescription() {
    return this.description
      .trim()
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/_/g, "-");
  }

  formattedStyles() {
    this.styles = this.sortStyles();
    var styleStrings = [];
    for (var s in this.styles) {
      styleStrings.push("  " + s + ": " + this.styles[s]);
    }
    return styleStrings.join(";\n") + ";";
  }

  sortStyles() {
    var self = this;
    var sorted = {};
    Object.keys(this.styles)
      .sort(this.selectorSorter)
      .forEach(function(key) { sorted[key] = self.styles[key]; });
    return sorted;
  }

  selectorSorter(a, b) {
    if (a.length > b.length && a.startsWith(b)) {
      return 1;
    }
    if (b.length > a.length && b.startsWith(a)) {
      return -1;
    }
    return a.localeCompare(b);
  }
}
