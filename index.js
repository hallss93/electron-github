'use strict';
module.exports = function (client_id, client_secret, width, height, mainWindow) {
    return new Promise((resolve, reject) => {
        const { BrowserWindow } = require('electron').remote

        let authWindow = new BrowserWindow({ width: width, height: height, show: false, parent: mainWindow, modal: true, webPreferences: { nodeIntegration: false } });
        let url = `https://github.com/login/oauth/authorize?client_id=` + client_id+ `&redirect_uri=https://github.com/login/oauth/authorize`
        authWindow.once('ready-to-show', () => {
            authWindow.show()
        })

        authWindow.loadURL(url);
        authWindow.show();
        authWindow.webContents.on('did-navigate', function (event, newUrl) {
            if (newUrl.indexOf("https://github.com/login/oauth/authorize?code=") > -1) {
                let raw_code = /code=([^&]*)/.exec(newUrl) || null;
                let token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
                var error = /\?error=(.+)$/.exec(newUrl);
                if (error) reject(error)
                request.post({
                    url: 'https://github.com/login/oauth/access_token', form: {
                        client_id: client_id,
                        client_secret: client_secret,
                        code: token,
                        redirect_uri: "https://github.com/login/oauth/authorize"
                    }
                }, function (err, httpResponse, body) {
                    if (err) reject(err)
                    let access_raw_code = /access_token=([^&]*)/.exec(body) || null;
                    var access_error = /\?error=(.+)$/.exec(newUrl);
                    if (access_error) reject(access_error)
                    let access_token = (access_raw_code && access_raw_code.length > 1) ? access_raw_code[1] : null;
                    request({ url: 'https://api.github.com/user?access_token=' + access_token, headers: { 'User-Agent': 'request', 'Authorization': 'token ' + access_token } }, function (err, resp, user) {
                        resolve(JSON.parse(user))
                        authWindow.close();
                    })
                })
            } else {
                authWindow.loadURL(url);
            }
        })
    })
}
