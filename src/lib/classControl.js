// функции проверки, доб., удаления классов у элементов
/**
 * проверка на наличие класса
 * @param {*} el 
 * @param {*} className 
 */
export function HasClass(el, className) {
  if (el.classList) return el.classList.contains(className)
  return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

/**
 * доб. класса к элементу
 * @param {*} el 
 * @param {*} className 
 */
export function AddClass(el, className) {
  console.log('add class', {el: el, className: className})
  if (el.classList) el.classList.add(className)
  else if (!HasClass(el, className)) el.className += ' ' + className
}

/**
 * удаление класса у элемента
 * @param {*} el 
 * @param {*} className 
 */
export function RemoveClass(el, className) {
  if (el.classList) el.classList.remove(className)
  else if (HasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className = el.className.replace(reg, ' ')
  }
}
