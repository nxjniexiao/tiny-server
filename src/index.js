const http = require('http');
const manageStaticFiles = require('./manageStaticFiles.js');
// 创建服务器
const srv = http.createServer((req, res) => {
  // 静态文件托管
  manageStaticFiles(req, res);
});
const IPAddress = getIPAddress();
srv.listen(8082, () => {
  const port = srv.address().port;
  console.log(
    'Your application is running here:',
    `http://localhost:${port} or`,
    `http://${IPAddress}:${port}`
  );
});
// 获取本机IP
function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
