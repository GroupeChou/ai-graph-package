const fs = require('fs-extra');
const path = require('path');

// 确保Electron主进程文件被复制到build目录
async function copyElectronFiles() {
  try {
    await fs.ensureDir(path.join(__dirname, '../build/electron'));
    await fs.copy(
      path.join(__dirname, 'electron'),
      path.join(__dirname, '../build/electron')
    );
    console.log('Electron文件复制成功！');
  } catch (err) {
    console.error('复制Electron文件时出错:', err);
  }
}

copyElectronFiles(); 