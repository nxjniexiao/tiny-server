function getHtmlStr(prevPath, filesArr) {
  const htmlPre =
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<meta http-equiv="X-UA-Compatible" content="ie=edge">' +
    '<title>文件列表</title>' +
    '<link rel="stylesheet" href="/tiny-server/lib/bootstrap.min.css">' +
    '<style>i{margin-right: 10px;color: #338BF8;}</style>' +
    '</head>' +
    '<body>' +
    '<div class="list-group center-block" style="width:900px; margin-top: 20px;">';
  const htmlLatter = '</div></body></html>';
  liArr = [];
  if (prevPath !== '/') {
    prevPath = prevPath + '/';
  }
  if (typeof filesArr[0] === 'string') {
    filesArr.forEach(function(file) {
      liArr.push(
        `<a class="list-group-item" href="${prevPath}${file}">${file}</a>`
      );
    });
  } else {
    // Dirent 实例
    filesArr.forEach(function(file) {
      const className = file.isDirectory() ? 'glyphicon glyphicon-folder-open' : 'glyphicon glyphicon-file';
      const icon = `<i class="${className}"></i>`;
      liArr.push(
        `<a class="list-group-item" href="${prevPath}${file.name}">${icon}${file.name}</a>`
      );
    });
  }
  liStr = liArr.join('');
  return htmlPre + liStr + htmlLatter;
}
module.exports = getHtmlStr;
