// @//ts-check
// import { Conventor, TimeControl, ConvertTools } from './core.js'
import { ConvertTools } from './core.js'
// import { multi } from '../lib/multipleClasses'
import configJS from './config'
import { getWebHtml } from './createHTML'

/**
 * класс для сборки макета анимации,
 * отвечает за проставление высот, ширин и отступов для элементов анимации,
 * с учетом того процентного соотношения их друг к другу
 */
export class BuildPhone {
  constructor(argsForBuilder) {
    // super()
    this.argsForBuilder = argsForBuilder
    this.height = this.getHW().height // wrapper_phone
    this.width = this.getHW().width // wrapper_phone
    this.phoneDisplayHeight = this.phone_display().height
    this.phoneDisplayWidth = this.phone_display().width

    this.marginsForPhoneDisplay = {
      marginTop: this.phone_display().margins.marginTop.toString(),
      marginRight: this.phone_display().margins.marginRight.toString(),
      marginBottom: this.phone_display().margins.marginBottom.toString(),
      marginLeft: this.phone_display().margins.marginLeft.toString(),
    }

    this.chatHeaderWrapperHeight = this.displayElements().topHeaderHeight
    this.chatTopHeaderContainerHeight = new ConvertTools().convert_percents_to_px(
      configJS['chatTopHeaderContainerPercentage'],
      this.getHW().height
    )
    this.chatContentHeight = this.displayElements().chatContentHeight // он же и max-height

    this.chatHeaderWrapperOtricatelnueMargins = {
      marginLeft: '-' + this.marginsForPhoneDisplay.marginLeft + 'px',
      marginRight: '-' + this.marginsForPhoneDisplay.marginRight + 'px',
    }
  } // construstor

  /**
   * возвращает объект с нужными высотами частей анимации
   */
  displayElements() {
    const height_ = this.getHW().height
    const topHeaderHeigthInConfig = new ConvertTools().convert_percents_to_px(
        configJS['topHeaderPercentage'],
        height_
      ),
      chatSendHeightInConfig = new ConvertTools().convert_percents_to_px(
        configJS['chatSendHeightPercentage'],
        height_
      ),
      chatSendHeight = chatSendHeightInConfig,
      topHeaderHeight = topHeaderHeigthInConfig,
      sumMarginsTopBottom =
        parseInt(this.marginsForPhoneDisplay.marginTop) +
        parseInt(this.marginsForPhoneDisplay.marginBottom),
      sumHeaderFooterMargins =
        chatSendHeight + topHeaderHeight + sumMarginsTopBottom,
      chatContentHeight = height_ - sumHeaderFooterMargins

    const parameters_elements = {
      chatSendHeight: chatSendHeight,
      topHeaderHeight: topHeaderHeight,
      chatContentHeight: chatContentHeight,
    }

    return parameters_elements
  }

  /**
   * возвращает высоту, ширину, отступы для контейнера анимации
   */
  phone_display() {
    const height = this.getHW().height
    const widht = this.getHW().width
    const marginsParam = configJS['marginsInPercentsForPhoneDisplay']
    const marginTop = 0
    const marginRight = marginsParam.marginRight,
      marginBottom = marginsParam.marginBottom,
      marginLeft = marginsParam.marginLeft
    const SumMarginsLeftRight = marginLeft + marginRight
    const SumMarginsTopBottom = marginTop + marginBottom // 0 + 10% of img in px

    const PDHeight = height - SumMarginsTopBottom
    const PDWidth = widht - SumMarginsLeftRight

    const parameters_display = {
      width: PDWidth,
      height: PDHeight,
      margins: {
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
      },
    }

    return parameters_display
  }

  /**
   * высчитывает и отдает высоту и ширину анимации
   */
  getHW() {
    var windowHeight = window.innerHeight

    if (windowHeight < 400) {
      windowHeight = 400
    }

    var tallage = 100 - configJS['marginsSumTopBottomInPercentsWindowAnimation'] // 100% - 10%(отступы по 5%) = 90%
    var heightPhone = (windowHeight / 100) * tallage // вычисление процентов
    var widthPhone = heightPhone / 2.04999

    const parameters = {
      // тут самое главное это сохранение пропорций, НУЖНО написать код на пропорции - Ширина к Высоте
      windowHeigth: window.innerHeight,
      width: widthPhone,
      height: heightPhone,
      coefficientForCurrentImg: 2.038, // разница сторон картинки(высоты к ширине)
    }
    return parameters
  }

  /**
   * создаем свой "плейсхолдер" для поля ввода (нужно чтобы можно было иметь контроль над ним)
   */
  setInputField() {
    // заменяем placeholder ( так как нормального доступа к параметрам у textarea::placeholder до сих пор(2020) нет и работает он криво)
    document.querySelector('.sendText').value = 'Сообщение...'
    document.querySelector('.sendText').style.opacity = '0.5'
  }

  /**
   * создаем html скелет для нашего приложения
   */
  initHTML() {
    document.querySelector('.container_main').innerHTML = getWebHtml
  }
}
