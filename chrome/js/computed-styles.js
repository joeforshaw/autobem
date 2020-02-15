class ComputedStyles {
  static getComputedStyles(element) {
    var styles = {};
    for (var i = 0; i < StylesCalculator.inheritableStyles.length; i++) {
      var inheritableStyle = ComputedStyles.inheritableStyles[i];
      var inheritableValue = ComputedStyles.getComputedStyle(
        element,
        inheritableStyle
      );
      styles[inheritableStyle] = inheritableValue;
    }
    return styles;
  }

  static getComputedStyle(element, styleProp) {
    var value,
      defaultView = (element.ownerDocument || document).defaultView;
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
      // sanitize property name to css notation
      // (hypen separated words eg. font-Size)
      styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
      return defaultView
        .getComputedStyle(element, null)
        .getPropertyValue(styleProp);
    } else if (element.currentStyle) {
      // IE
      // sanitize property name to camelCase
      styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
        return letter.toUpperCase();
      });
      value = element.currentStyle[styleProp];
      // convert other units to pixels on IE
      if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
        return (function(value) {
          var oldLeft = element.style.left,
            oldRsLeft = element.runtimeStyle.left;
          element.runtimeStyle.left = element.currentStyle.left;
          element.style.left = value || 0;
          value = element.style.pixelLeft + "px";
          element.style.left = oldLeft;
          element.runtimeStyle.left = oldRsLeft;
          return value;
        })(value);
      }
      return value;
    }
  }
}