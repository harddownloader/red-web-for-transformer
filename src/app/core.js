/**
 * класс для работы с процентами
 * нужен для поставления нужных пропорций высоты, ширины, отступов разным элементам (конвертация процентов в пиксели)
 */
export class ConvertTools {
  /**
   * нахождение процента от числа
   * @param {*} percent 
   * @param {*} total 
   */
  convert_percents_to_px(percent, total) {
    var result = (percent / 100) * total
    return result // px
  }
}
