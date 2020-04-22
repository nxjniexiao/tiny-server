const url = require('url');
const buffer = require('buffer');
function manageJson(req, res) {
  const queryMap = url.parse(req.url, true).query; // true: urlObj.query 被转化为对象
  const operation = queryMap.operation;
  const operationsMap = {
    get_node: getNode,
  };
  const createData = operationsMap[operation];
  const data = JSON.stringify(createData && createData(queryMap));
  const chunk = Buffer.from(data || '');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(chunk);
}
// 树形结构获取子节点
function getNode(queryMap) {
  const id = queryMap.id;
  const level = id.split('-').length;
  let data;
  if (id === '#') {
    data = [{ id: '1', text: '根节点', children: true }];
  } else {
    data = [];
    for (let i = 0; i < 10; i++) {
      const childId = id + '-' + (i + 1);
      data.push({
        id: childId,
        pid: id,
        text: 'node ' + childId,
        children: level < 2
      });
    }
  }
  return data;
}
module.exports = manageJson;
