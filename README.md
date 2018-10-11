# electron-github

> Módulo para login com GitHub e Electron.

## Como iniciar

_Start:_

1. Instale a dependência com `npm i --save electron-github`
2. Importe a biblioteca:
````javascript
const { ipcRenderer, remote } = require('electron')
const { BrowserWindow } = remote
import ef from 'electron-github';
ef('CLIENT_ID', 'CLIENT_SECRET', 800, 400, BrowserWindow.getAllWindows().filter((e)=>e.id==1))
.then(console.log);
        ```
