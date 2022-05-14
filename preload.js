const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  openDialog: async () => ipcRenderer.invoke("open-dialog"),
});
