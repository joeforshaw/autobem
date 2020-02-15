class Dialog {
  constructor(block, nodes) {
    this.block = block;
    this.nodes = nodes;
    this.index = 0;
    this.dialog = null;
  }

  start() {
    this.tidyUp();
    this.buildDialog();
    this.buildHighlight();
    this.reposition();
    this.render();
  }

  tidyUp() {
    this.removeById('autobem-dialog');
    this.removeById('autobem-highlight');
  }

  removeById(id) {
    var existingElement = document.getElementById(id);
    if (existingElement) {
      existingElement.parentNode.removeChild(existingElement);
    }
  }

  buildDialog() {
    // Create elements
    this.dialog = document.createElement("div");
    this.form = document.createElement("form");
    this.title = document.createTextNode("What's this?");
    this.input = document.createElement("input");
    this.previousButton = document.createElement("button");
    this.nextButton = document.createElement("button");

    // Set styles
    this.dialog.id = 'autobem-dialog';
    this.dialog.style.backgroundColor = "white";
    this.dialog.style.border = "solid 1px lightgrey";
    this.dialog.style.borderRadius = "5px";
    this.dialog.style.position = "fixed";
    this.dialog.style.padding = "8px";
    this.dialog.style.transition = "top 0.2s, left 0.2s";
    this.dialog.style.boxShadow = "lightgrey 5px 5px";

    this.input.type = "text";
    this.input.style.display = "block";
    this.input.style.width = "200px";
    this.input.style.margin = "0 0 8px 0";
    this.input.placeholder = "Description";

    this.previousButton.innerHTML = "Previous";
    this.previousButton.style.float = "left";
    this.previousButton.style.cursor = "pointer";
    
    this.nextButton.innerHTML = "Next";
    this.nextButton.style.float = "right";
    this.nextButton.style.cursor = "pointer";

    // Insert elements
    this.form.appendChild(this.title);
    this.form.appendChild(this.input);
    this.dialog.appendChild(this.form);
    this.dialog.appendChild(this.previousButton);
    this.dialog.appendChild(this.nextButton);
    document.body.appendChild(this.dialog);
  }

  setupEventListeners() {
    var self = this;
    this.input.oninput = function(e) {
      self.onInput(e);
    };
    this.nextButton.onclick = function(e) {
      self.onNext(e);
    };
    this.previousButton.onclick = function(e) {
      self.onPrevious(e);
    };
    this.dialog.onsubmit = function(e) {
      e.preventDefault();
      self.onNext(e);
    };
    window.addEventListener('resize', function(e) {
      self.reposition();
    });
  }

  buildHighlight() {
    this.highlight = document.createElement("div");

    this.highlight.id = "autobem-highlight";
    this.highlight.style.position = "fixed";
    this.highlight.style.backgroundColor = "#9FC4E7";
    this.highlight.style.opacity = 0.6;

    document.body.appendChild(this.highlight);
  }

  currentNode() {
    return this.nodes[this.index];
  }

  reposition() {
    var dialogPosition = this.positionForDialog();
    this.dialog.style.top = dialogPosition.top + "px";
    this.dialog.style.left = dialogPosition.left + "px";

    var highlightPosition = this.positionForHighlight();
    this.highlight.style.top = highlightPosition.top + "px";
    this.highlight.style.left = highlightPosition.left + "px";
    this.highlight.style.width = highlightPosition.width + "px";
    this.highlight.style.height = highlightPosition.height + "px";
  }

  positionForDialog() {
    var node = this.currentNode();
    var rect = node.element.getBoundingClientRect();
    var win = node.element.ownerDocument.defaultView;

    return {
      top: rect.top + rect.height + win.pageYOffset + 8,
      left: rect.left + win.pageXOffset
    };
  }

  positionForHighlight() {
    var node = this.currentNode();
    var rect = node.element.getBoundingClientRect();
    var win = node.element.ownerDocument.defaultView;

    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset,
      height: rect.height,
      width: rect.width
    };
  }

  render() {
    this.currentNode().description = this.currentNode().defaultDescription(this.nodes);
    this.input.value = this.currentNode().description;
    this.input.focus();
    this.setupEventListeners();
    this.reposition();
    this.updateNextButton();
  }

  onInput(e) {
    this.currentNode().description = e.target.value;
    this.updateNextButton();
  }

  updateNextButton() {
    this.nextButton.disabled = !this.currentNode().description;
    this.nextButton.innerHTML = this.index === this.nodes.length - 1 ? 'Finish' : 'Next';
  }

  onNext(e) {
    if (this.nextButton.disabled) { return; }
    var oldIndex = this.index;
    this.index = Math.min(this.index + 1, this.nodes.length - 1);
    if (this.index !== oldIndex) {
      this.render();
    }
    if (oldIndex === this.nodes.length - 1) {
      this.finish();
    }
  }

  isFinishing() { return this.index === this.nodes.length - 1; }

  finish() {
    document.body.removeChild(this.dialog);
    new CSSExporter(this.nodes).export();
  }

  onPrevious(e) {
    var oldIndex = this.index;
    this.index = Math.max(this.index - 1, 0);
    if (this.index !== oldIndex) {
      this.render();
    }
  }
}
