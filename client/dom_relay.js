var ipc = require("electron").ipcRenderer;
document.addEventListener("DOMContentLoaded", function() {
  ipc.sendToHost("window-data", document.children[0].outerHTML);
});
