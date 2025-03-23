// 这个文件只是为了被复制到build目录，实际代码在public/electron/main.js中
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// 重定向到实际的主进程文件
require('./electron/main'); 