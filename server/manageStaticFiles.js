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
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlStr);
      })
      .catch(err => {
        console.log(err);
        resFailed("未找到文件夹");
      });
  }
  // 封装函数，返回文件
  function resWithFile(filePathNormalized) {
    let contentType = mimeTypes[extname]; // 获取后缀名
    if (/text|javascript/.test(contentType)) {
      contentType = contentType + ";charset=utf-8";
    }
    if (!contentType) {
      resFailed("没有对应的 Content-Type");
      return;
    }
    res.setHeader("Content-Type", contentType);
    const range = req.headers.range; // 部分请求 Range: bytes=0- 或者 Range: bytes=0-1
    if (range) {
      // 请求头中有 Range 字段
      resRange(range, filePathNormalized);
      return;
    }
    // 请求头中无 Range 字段
    res.statusCode = 200;
    const rs = file.createReadStream(filePathNormalized);
    rs.on("error", (err) => {
      console.log(err);
      resFailed("文件不存在");
    });
    rs.pipe(res); // 流传输，减小服务器压力
  }
  // 封装函数，处理 Range 请求
  function resRange(range, filePathNormalized) {
    console.log('Range: ' + range);
    let position = range.replace("bytes=", "").split("-");
    let fileSize = 0;
    file
      .stat(filePathNormalized)
      .then(stats => {
        fileSize = stats.size; // 文件大小
        const start = parseInt(position[0]); // 起始位置(坑:字符串转为整数)
        const end = position[1] ? parseInt(position[1]) : fileSize - 1; // 结束位置(坑:字符串转为整数)
        const partialSize = end - start + 1;
        res.statusCode = 206; // 206: partial content
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
        // res.setHeader("Content-Length", partialSize);
        // res.setHeader("Cache-Control", "no-cache");
        console.log(`Content-Range: bytes ${start}-${end}/${fileSize}`);
        const rs = file.createReadStream(filePathNormalized, {
          start,
          end
        }); // 返回可读流
        rs.on("error", (err) => {
          console.log(err);
          resFailed("文件读取出错");
        });
        rs.pipe(res);
      })
      .catch(err => {
        console.log(err);
        resFailed("文件不存在");
      });
  }
  // 封装函数，出错时返回 404 和错误信息
  function resFailed(msg) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain;charset=utf-8");
    res.end(msg);
  }
}
module.exports = manageStaticFiles;
