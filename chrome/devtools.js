chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {  
  chrome.devtools.inspectedWindow.eval(
    "runAutoBEM($0)", 
    { useContentScriptContext: true }
  );
});
