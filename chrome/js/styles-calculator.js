class StylesCalculator {
  static setup() {
    StylesCalculator.inheritableStyles = [
      "azimuth",
      "border-collapse",
      "border-spacing",
      "caption-side",
      "color",
      "cursor",
      "direction",
      "elevation",
      "empty-cells",
      "font-family",
      "font-size",
      "font-style",
      "font-variant",
      "font-weight",
      "font",
      "letter-spacing",
      "line-height",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "list-style",
      "orphans",
      "pitch-range",
      "pitch",
      "quotes",
      "richness",
      "speak-header",
      "speak-numeral",
      "speak-punctuation",
      "speak",
      "speech-rate",
      "stress",
      "text-align",
      "text-indent",
      "text-transform",
      "visibility",
      "voice-family",
      "volume",
      "white-space",
      "widows",
      "word-spacing",
      "-webkit-font-smoothing"
    ];   

    StylesCalculator.rules = [];
    StylesCalculator.sheets = document.styleSheets;
    StylesCalculator.defaultStyles = {};

    for (var i in StylesCalculator.sheets) {
      try {
        var rulesForSheet =
          StylesCalculator.sheets[i].rules ||
          StylesCalculator.sheets[i].cssRules;
        for (var r in rulesForSheet) {
          StylesCalculator.rules.push(rulesForSheet[r]);
        }
      } catch (e) {
        console.debug(
          "Failed to fetch CSS rules for " +
            StylesCalculator.sheets[i].href +
            ". Likely a CORS issue."
        );
      }
    } 
  }

  constructor(node) {
    this.node = node;
    this.declarations = [];
    this.styles = {};
  }

  run() {
    this.findMatchingDeclarations();
    this.sortDeclarationsBySpecificity();
    this.mergeAndRemoveOverwrittenStyles()
    this.mergeInheritedStyles();
    return this.styles;
  }

  findMatchingDeclarations() {
    for (var r in StylesCalculator.rules) {
      if (!this.matches(StylesCalculator.rules[r].selectorText)) {
        continue;
      }
      var cssText = StylesCalculator.rules[r].cssText;
      var newDeclarations = this.extractDeclarations(cssText);
      this.declarations = this.declarations.concat(newDeclarations);
    }
  }

  sortDeclarationsBySpecificity() {
    this.declarations.sort(function(a, b) {
      return compareSpecificity(a.selector, b.selector);
    });
  }

  mergeAndRemoveOverwrittenStyles() {
    var finalStyles = this.styles;
    for (var d in this.declarations) {
      for (var r in this.declarations[d].rules) {
        var value = this.declarations[d].rules[r];
        // Ignore inherited values, BEM doesn't like them
        if (value == "inherit") {
          continue;
        }
        finalStyles[r] = value;
      }
    }
    return finalStyles;
  }

  selectorsFromCSSText(cssText) {
    return cssText.substr(0, cssText.indexOf(" {")).split(",");
  }

  rulesFromCSSText(cssText) {
    var ruleKeyValues = cssText
      .substring(cssText.lastIndexOf("{ ") + 2, cssText.lastIndexOf(" }"))
      .split(";");

    var rules = {};
    for (var i = 0; i < ruleKeyValues.length; i++) {
      var ruleParts = ruleKeyValues[i].trim().split(": ");
      if (!ruleParts[0]) {
        continue;
      }
      rules[ruleParts[0]] = ruleParts[1];
    }
    return rules;
  }

  extractDeclarations(cssText) {
    // Reduce multiselector into only the matching selectors
    // e.g. 'html, body' to ['html', 'body']
    var selectors = this.selectorsFromCSSText(cssText);
    var declarations = [];
    for (var i = 0; i < selectors.length; i++) {
      var selector = selectors[i].trim();
      if (!this.matches(selector)) {
        continue;
      }
      declarations.push({
        selector: selector,
        rules: this.rulesFromCSSText(cssText)
      });
    }
    return declarations;
  }

  matches(selector) {
    return this.node.element.matches(selector);
  }

  mergeInheritedStyles() {
    for (var i = 0; i < StylesCalculator.inheritableStyles.length; i++) {
      var inheritableStyle = StylesCalculator.inheritableStyles[i];

      if (inheritableStyle in this.styles) {
        continue;
      }

      var currentNode = this.node.parent;
      var inheritableValue = currentNode ? currentNode.styles[inheritableStyle] : null;
      while (currentNode && !inheritableValue) {
        currentNode = currentNode.parent;
        inheritableValue = currentNode ? currentNode.styles[inheritableStyle] : null;
      }

      if (inheritableValue) {
        if (inheritableValue.endsWith('rem')) {
          // TODO: do something
        } else if (inheritableValue.endsWith('em')) {
          inheritableValue = Units.convertEmContext(inheritableValue, currentNode.element, this.node.element);
        }
        this.styles[inheritableStyle] = inheritableValue;
      }
    }
  }
}

StylesCalculator.setup();
