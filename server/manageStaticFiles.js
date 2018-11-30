const url = require("url");
const file = require("./file.js");
const mimeTypes = require("./mime.json");
const getHtmlStr = require("./getHtmlStr.js");

function manageStaticFiles(req, res, staticFolderPath) {
  const urlObj = url.parse(req.url, true); // true: urlObj.query 被转化为对象
  const pathname = decodeURIComponent(urlObj.pathname); // 解码
  const extname = file.getExtname(pathname); // 后缀名
  switch (pathname) {
    case "/favicon.ico":
      return;
    default:
      response();
  }
  function response() {
    const filePath = staticFolderPath + pathname;
    const filePathNormalized = file.getNormalizedFilePath(filePath); // 绝对路径
    // console.log(pathname);
    // console.log(filePathNormalized);
    if (!extname) {
      // 无后缀名，返回包含文件列表的 HTML
      resWithHtml(pathname, filePathNormalized);
      return;
    }
    // 有后缀名，返回文件
    resWithFile(filePathNormalized);
  }
  // 封装函数，返回HTML
  function resWithHtml(prevPath, filePathNormalized) {
    let htmlStr = null;
    file
      .readDir(filePathNormalized)
      .then(files => {
        htmlStr = getHtmlStr(prevPath, files);
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end(htmlStr);
      })
      .catch(err => {
        res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
        res.end("未找到文件夹");
      });
  }
  // 封装函数，返回文件
  function resWithFile(filePathNormalized) {
    let contentType = mimeTypes[extname]; // 获取后缀名
    if (!contentType) {
      res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
      res.end("没有对应的 Content-Type");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType + ";charset=utf-8" });
    file
      .readFile(filePathNormalized)
      .then(data => {
        res.end(data);
      })
      .catch(err => {
        res.end("文件不存在");
      });
  }
}
module.exports = manageStaticFiles;
