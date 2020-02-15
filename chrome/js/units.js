class Units {
  static getElementFontSize(context) {
    // Returns a number
    return parseFloat(
      getComputedStyle(
        context || document.documentElement
      ).fontSize
    );
  }
  
  static convertRem(value) {
    var value = Units.parseValue(value, "rem") * Units.getElementFontSize();
    return value + 'px';
  }
  
  static convertEm(value, context) {
    var value = Units.parseValue(value, "em") * Units.getElementFontSize(context);
    return value + 'px';
  }

  static convertEmContext(value, oldContext, newContext) {
    var ratio = Units.getElementFontSize(oldContext) / Units.getElementFontSize(newContext);
    var newEm = Units.parseValue(value, "em") * ratio;
    return newEm + 'em';
  }

  static parseValue(value, unit) {
    return parseFloat(value.substring(0, value.indexOf(unit)));
  }
}