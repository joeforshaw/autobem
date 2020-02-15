/*
 * TODO:
 * - Media queries
 * - Inline styles
 * - Pseudo elements
 * - Export BEMified html as well? Would need to preserve all attributes
 * 
 * Possible user options:
 * - Preferred units px/rem
 * - Export as CSS/SCSS/SASS/LESS?
 */

function runAutoBEM(block) {
  var html = document.getElementsByTagName("html")[0];  
  var styleTree = new StyleTree(html, block);
  new Dialog(styleTree.root, styleTree.list).start();
}

