const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("voiceRecorder", {
  openInputDialog: async () => ipcRenderer.invoke("open-input-dialog"),
  saveWavFile: async (directoryPath, filename, data) =>
    ipcRenderer.invoke("save-wav-file", [directoryPath, filename, data]),
});
