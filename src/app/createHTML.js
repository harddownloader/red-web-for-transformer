/**
 * отдает путь к текущей директории
 */
function getCurrentDirectory() {
  const loc = window.location.pathname
  const dir = loc.substring(0, loc.lastIndexOf('/'))
  return dir
}

/**
 * отдает полный путь к html файлу анимации
 */
function getPathToHtmlFile() {
  const currentPath = getCurrentDirectory()
  return currentPath + '/chats/assets/html/redWeb.html'
}

/**
 * функция для получения html файла теккущей анимации
 * p.s. через XHR, а не fetch - чтобы жрал меньше памяти
 * @param {*} url 
 */
export function getWebHtml(url = getPathToHtmlFile()) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'document'
    xhr.onload = function () {
      var status = xhr.status
      if (status == 200) {
        resolve(xhr.response.documentElement.innerHTML)
      } else {
        reject(status)
      }
    }
    xhr.send()
  })
}
