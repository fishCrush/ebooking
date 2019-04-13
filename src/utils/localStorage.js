import Storage from 'web-storage-cache'
// 引入已加载的和localStorage相关的库
const localStorage = new Storage()
// 通过new ...进行实例 得到一个localStorage对象
// 封装一些可操作localStorage的函数（基于其原有的函数）
// localStorage的已有方法：set(...,...),get(...),delete(...),clear()
/* eslint-disable */
export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}
export function getLocalStorage(key) {
  return localStorage.get(key)
}
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}
export function clearLocalStorage() {
  return localStorage.clear()
}

export function setBookObject(fileName, key, value) {
 // 因为每本电子书存储的东西可能不一样，所以可以定义：
  // 第一个需要传入书名；每本书下面又有一个{key:value}这样的存储内容
  let book = getLocalStorage(`${fileName}-info`)
  // -info是我们的一些设置信息
  if (!book) {
    book = {} // 若不存在该book对象则先创建该对象再赋值
  }
    book[key] = value
   setLocalStorage(`${fileName}-info`, book)
}
export function getBookObject(fileName, key) {
  let book = getLocalStorage(`${fileName}-info`)
  if (book) {
     return book[key]
  } else {
    return null
  }
}

// 取默认语言
export function getLocale() {
  return getLocalStorage('locale')
}
// 设默认语言
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}

export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}
