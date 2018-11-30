function getHtmlStr(prevPath, filesArr) {
  const htmlPre =
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>文件列表</title></head><body><ul>';
  const htmlLatter = "</ul></body></html>";
  liArr = [];
  if (prevPath !== "/") {
    prevPath = prevPath + "/";
  }
  for (let i = 0, len = filesArr.length; i < len; i++) {
    liArr.push(
      `<li><a href="${prevPath}${filesArr[i]}">${filesArr[i]}</a></li>`
    );
  }
  liStr = liArr.join('');
  return htmlPre + liStr + htmlLatter;
}
module.exports = getHtmlStr;
