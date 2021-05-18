import {deepCompare} from './CompareObjects'

// помечаем текущий диалог как использованный
export function markCurrentMessageAsUsed (dialogs, i_forTimer) {
  if (localStorage.getItem('currentAnimationDialog')) {
    const lsDialogsWithoutFormating = localStorage.getItem('currentAnimationDialog')
    const lsDialogs = JSON.parse(lsDialogsWithoutFormating)

    if (typeof lsDialogs[i_forTimer].text === 'object') {
      if (
        deepCompare(
          lsDialogs[i_forTimer].text,
          dialogs[i_forTimer].text
        )
      ) {
        lsDialogs[i_forTimer].used = true
        localStorage.setItem('currentAnimationDialog', JSON.stringify(lsDialogs))
        return true
      }
    } else if (typeof lsDialogs[i_forTimer].text === 'string') {
      if (lsDialogs[i_forTimer].text === dialogs[i_forTimer].text ) {
        console.log('текста равны && нет свойства used,т.е. диалог не использваолся')
        console.log('item.text', lsDialogs[i_forTimer].text)
        console.log('dialogs[i_forTimer].text', dialogs[i_forTimer].text)
        lsDialogs[i_forTimer].used = true
        localStorage.setItem('currentAnimationDialog', JSON.stringify(lsDialogs))
        return true
      }
    }
    
    
    
    
    return false
  }
}

// является ли текущий идалог использованым
export function checkCurrentMessageAsUsed (dialogs, i_forTimer) {
  if (localStorage.getItem('currentAnimationDialog')) {
    const lsDialogsWithoutFormating = localStorage.getItem('currentAnimationDialog')
    const lsDialogs = JSON.parse(lsDialogsWithoutFormating)
    // if(lsDialogs[i_forTimer].text != dialogs[i_forTimer].text) {
    //   // alert(0)
    // }

    if (
      typeof lsDialogs[i_forTimer].text === 'object' &&
      deepCompare(lsDialogs[i_forTimer].text, dialogs[i_forTimer].text) &&
      lsDialogs[i_forTimer].hasOwnProperty('used')
    ) {
      return true
    } else if (
      typeof lsDialogs[i_forTimer].text === 'string' &&
      lsDialogs[i_forTimer].text === dialogs[i_forTimer].text &&
      lsDialogs[i_forTimer].hasOwnProperty('used')
    ) {
      return true
    }
    
    return false
  }
}