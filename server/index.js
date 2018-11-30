const http = require('http');
const manageStaticFiles = require('./manageStaticFiles.js');
// 创建服务器
const srv = http.createServer((req, res) => {
  // 静态文件托管
  manageStaticFiles(req, res, '');
});
// 本机 IP 地址：192.168.8.101
srv.listen(3000, '192.168.8.101', () => {
  const address = srv.address().address;
  const port = srv.address().port;
  console.log('http://%s:%s', address, port);
})