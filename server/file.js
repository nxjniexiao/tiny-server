const fs = require("fs");
const path = require("path");

const file = {
  // 封装 fs.readFile，返回一个 Promise 对象
  readFile: function(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
  // 封装 fs.readdir，返回一个 Promise 对象
  readDir: function(filePath) {
    return new Promise((resolve, reject) => {
      fs.readdir(filePath, (err, files) => {
        if (err) {
          return reject(err);
        }
        return resolve(files); // array
      });
    });
  },
  // 封装函数：获得符合平台特性的绝对路径
  getNormalizedFilePath: function(filePath) {
    // fs.readFile() 解析路径时，当前工作目录是启动 server 时的目录，
    // 不是 js 文件所在的目录。而 __dirname 表示 js 文件所在目录。
    // 所以最好使用 path.join() 根据平台特性生成绝对路径。
    return path.join(__dirname, "../", filePath);
  },
  // 封装函数：返回后缀名
  getExtname(filePath) {
    return path.extname(filePath);
  },
  // 封装 fs.stat 返回一个 Promise 对象
  stat: function(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if(err) {
          return reject(err);
        }
        return resolve(stats);
      })
    })
  },
  createReadStream: fs.createReadStream,
};
module.exports = file;
