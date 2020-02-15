class CSSExporter {
  constructor(nodes) {
    this.nodes = nodes;
    this.blockNode = this.nodes.shift();
    this.blockName = this.blockNode.formattedDescription();
    this.content = null;
  }

  export() {
    this.removeDuplicateNodes();
    this.content = this.buildContent();
    this.download();
  }

  toBEMSelector(node) {
    return '.' + this.blockName + '__' + node.formattedDescription();
  }

  buildContent() {
    var self = this;
    var groups = [
      '.' + this.blockName + ' {\n' + this.blockNode.formattedStyles() + '\n}'
    ];
    var elements = this.nodes.map(function(node) {
      return self.toBEMSelector(node) + ' {\n' + node.formattedStyles() + '\n}';
    });
    return groups.concat(elements).join("\n\n") + '\n';
  }

  download() {
    var downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.content));
    downloadLink.setAttribute('download', this.blockName + '.css');
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  removeDuplicateNodes() {
    var seen = {};
    this.nodes = this.nodes.filter(function(node) {
      var key = node.formattedDescription();
      return seen.hasOwnProperty(key) ? false : (seen[key] = true);
    });
  }
}
