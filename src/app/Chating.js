/* eslint-disable prefer-const */
import SimpleBar from 'simplebar'
import 'simplebar/dist/simplebar.css'

import { AddClass } from '../lib/classControl'
import { FX } from '../lib/fadeInFadeOut'
import { BuildPhone } from './Builder'

import '../lib/timerHub' // чтобы мочь застопить все анимации если нужно закрыть окно
import { ControlChatScrollEvent } from '../lib/controlChatScrollEvent'
import {markCurrentMessageAsUsed, checkCurrentMessageAsUsed} from './TransformerDialogsMigration'


/**
 * класс отвечающий за переписку
 */
export class Chating {
  constructor() {
    // создание тел. скролла
    this.simplebar = new SimpleBar(document.getElementById('chatContent'), {
      autoHide: false,
    })
    this.ControlChatScrollEvent = ControlChatScrollEvent
  }

  /**
   * созд. скелет(шаблон) сообщения
   * @param {*} appIcon 
   * @param {*} time 
   * @param {*} dialog 
   */
  createMessageHtmlItem(appIcon, time, dialog) {
    const MessageHtmlItem =
      appIcon +
      '\n' +
      '<div class="item">\n' +
      '<div class="message-date">' +
      time +
      '</div>\n' +
      '<div class="chat-message">' +
      dialog +
      '</div>\n' +
      '</div>'

    return MessageHtmlItem
  }

  /**
   * ставим аватарку отправителя сообщения
   * @param {*} typeSet 
   */
  getAvatar(typeSet) {
    let AppIcon
    if (typeSet == 'customer') {
      // is app
      AppIcon =
        '<div class="item">\n' +
        '<div class="chat-icon"><img width="30" src="chats/assets/img/LogoKubSvg28x28.svg"></div>\n' +
        '</div>'
    } else if (typeSet == 'company') {
      // is user
      AppIcon =
        '<div class="item">\n' +
        '<div class="chat-icon">\n' +
          '<picture>\n' +
          '<source srcset="chats/assets/img/userAvatar2_blue.webp" type="image/webp">\n' +
          '<source srcset="chats/assets/img/userAvatar2_blue.png" type="image/png"> \n' +
          '<img src="chats/assets/img/userAvatar2_blue.png" width="25px">\n' +
        '</picture>\n' +
        '</div>\n' +
        '</div>'
    }

    return AppIcon
  }

  /**
   * убирает класс "lasted" у всех кнопок в истории диалога
   * (нужно чтобы назначить новую самую последнюю кнопку в списке диалога) 
   */
  checkAllLastedAsOld() {
    const allLastedBtns = document.querySelectorAll(
      '.chat_options button.option_btn.choose.lasted'
    )
    allLastedBtns.forEach((element) => {
      element.classList.remove('lasted')
    })
  }

  /**
   * создает уникальные сообщения:
   * 1. таблица
   * 2. кнопки опций да/нет
   * 3. кнопки опций для любого списка вариантов выборов
   * @param {*} typeSet 
   * @param {*} options_html_container 
   * @param {*} options 
   */
  generatorOptions(typeSet, options_html_container, options) {
    if (typeSet == 'customer') {
      // is app
      // если нужны кнопки ДА/НЕТ или список
      if (options) {
        options_html_container = document.createElement('div')
        options_html_container.classList.add('options_wrapper')
        options_html_container.style.opacity = '0'

        var options_html_content = ''
        if (options === 'table') {
          options_html_content =
            '<div class="grid-container">' +
            '<div class="before-grid">' +
            '<span>.XLSX</span>' +
            '<span>.CSV</span>' +
            '</div>' +
            '<div class="grid two_rows">' +
            '<span><strong>Наименование</strong></span>' +
            '<span><strong>Значение</strong></span>' +
            '<span>ФИО</span>' +
            '<span>Иванов Петр Иванович</span>' +
            '<span>Подразделение</span>' +
            '<span>Отдел продаж</span>' +
            '<span>Должность</span>' +
            '<span>Менеджер</span>' +
            '<span>Оплата по окладу</span>' +
            '<span>30 000</span>' +
            '<span>Надбавка за квалификаци</span>' +
            '<span>5000</span>' +
            '<span>Премия месячная</span>' +
            '<span>10000</span>' +
            '<span>Отпускные</span>' +
            '<span>25000</span>' +
            '<span>Больничные</span>' +
            '<span>5000</span>' +
            '<span class="without_border">Всего начислено</span>' +
            '<span class="without_border">45000</span>' +
            '</div>' +
            '</div>'
          options_html_container.innerHTML = options_html_content
        } else if (options === 'table2') {
          options_html_content =
            '<div class="grid-container">' +
            '<div class="before-grid">' +
            '<span>.XLSX</span>' +
            '<span>.CSV</span>' +
            '</div>' +
            '<div class="grid two_rows">' +
            '<span><strong>Выплачено</strong></span>' +
            '<span><strong>Сумма</strong></span>' +
            '<span>Аванс</span>' +
            '<span>15 000</span>' +
            '<span class="without_border"><strong>Всего выплачено</strong></span>' +
            '<span class="without_border"><strong>15 000</strong></span>' +
            '</div>' +
            '</div>'
          options_html_container.innerHTML = options_html_content
        } else if (options === 'table3') {
          options_html_content =
            '<div class="grid-container">' +
            '<div class="before-grid">' +
            '<span>.XLSX</span>' +
            '<span>.CSV</span>' +
            '</div>' +
            '<div class="grid two_rows">' +
            '<span><strong>Дней отпуска</strong></span>' +
            '<span>20</span>' +
            '<span>Плановая Дата начала отпуска</span>' +
            '<span>15.10.2021</span>' +
            '<span>Использовано дней</span>' +
            '<span>12</span>' +
            '<span class="without_border">Осталось дней</span>' +
            '<span class="without_border">8</span>' +
            '</div>' +
            '</div>'
          options_html_container.innerHTML = options_html_content
        } else if (options === 'table4') {
          options_html_content =
            '<div class="grid-container">' +
            '<div class="before-grid">' +
            '<span>.XLSX</span>' +
            '<span>.CSV</span>' +
            '</div>' +
            '<div class="grid five_rows">' +
            '<span><strong>Номер счета</strong></span>' +
            '<span><strong>Статус платежа</strong></span>' +
            '<span><strong>Дата оплаты</strong></span>' +
            '<span><strong>Сумма оплаты</strong></span>' +
            '<span><strong>Валюта оплаты</strong></span>' +
            '<span>187</span>' +
            '<span>Включен в график платежей</span>' +
            '<span></span>' +
            '<span>100000.00</span>' +
            '<span>RUB</span>' +
            '<span class="without_border">266</span>' +
            '<span class="without_border">Оплачен</span>' +
            '<span class="without_border">18.04.2021</span>' +
            '<span class="without_border">20250.00</span>' +
            '<span class="without_border">RUB</span>' +
            '</div>' +
            '</div>'
          options_html_container.innerHTML = options_html_content
        } else if (typeof options === 'boolean') {
          // yes or no
          options_html_content =
            '<div class="chat_options">' +
            '<div class="optin_item option_yes">' +
            '<button class="option_btn">1. Да</button>' +
            '</div>' +
            '<div class="optin_item option_no">' +
            '<button class="option_btn">2. Нет</button>' +
            '</div>' +
            '</div>'
          options_html_container.innerHTML = options_html_content
        } else if (typeof options === 'object') {
          // list
          this.checkAllLastedAsOld() // убираем у всех пред. кнопок списков класс lasted , это поможет идентифицировать самые последние кнопки
          options_html_content = '<div class="chat_options">'
          for (let i = 0; i < options.length; i++) {
            let value = options[i]
            options_html_content =
              options_html_content +
              '<div class="optin_item"><button class="option_btn choose lasted">' +
              String(i + 1) +
              '. ' +
              value +
              '</button></div>'
          }
          options_html_content = options_html_content + '</div>'
          options_html_container.innerHTML = options_html_content
        }
      }
    }

    return options_html_container
  }

  /**
   * определяем от кого это сообщение будет отправленно
   * @param {*} from 
   */
  setTypeSet(from) {
    let typeSet
    from == 'user' ? (typeSet = 'company') : (typeSet = 'customer') // detect msg

    return typeSet
  }

  /**
   * создает(добавляет) "отправленное сообщение" в диалог
   * @param {*} from 
   * @param {*} dialog 
   * @param {*} time 
   * @param {*} options 
   */
  buildMessage(
    from,
    dialog,
    time,
    options,
    delay,
    dialogs,
    i_forTimer
  ) {
    var msg_list = document.getElementsByClassName('chatContentWrapper')

    // определяем от кого это сообщение будет отправленно
    var typeSet = this.setTypeSet(from) // msg company or customer
    // готовим для опций,
    var options_html_container = ''
    
    // получаем кнопки да,нет(для app)
    options_html_container = this.generatorOptions(
      typeSet,
      options_html_container,
      options
    )
    // получаем аватарку(для user,app)
    const appIcon = this.getAvatar(typeSet)
    var container = document.createElement('div')
    container.classList.add('chat-column', typeSet)

    container.style.opacity = '0'

    const content = this.createMessageHtmlItem(appIcon, time, dialog)

    container.innerHTML = content
    msg_list[0].appendChild(container)
    var chat_columns = document.querySelectorAll('.chat-column')

    let fadeInDuration = 1000

    // console.log('buildMessage - delay', delay)
    if(delay === 0) {
      fadeInDuration = 0
    }
    

    var count = chat_columns.length - 1
    new FX().fadeIn(chat_columns[count], {
      duration: fadeInDuration,
      complete: function () {
        // console.log('Complete')
      },
    })

    if (options_html_container != '') {
      msg_list[0].appendChild(options_html_container)
      var options_wrapper = document.querySelectorAll('.options_wrapper')
      new FX().fadeIn(options_wrapper[options_wrapper.length - 1], {
        duration: fadeInDuration,
        complete: function () {
          // console.log('Complete')
        },
      })
    }

    document.querySelector('.sendText').value = ''
    new BuildPhone().setInputField() // ставим "placeholder" полю ввода

    // Scroll
    async function AnimationScrollInRecursion(i, delayScroll) {
      const timeout = (ms) =>
        new Promise((resolve) =>
          window.timerHub.setTimeout('preBuildMessageApp', resolve, ms)
        )

      // console.log('AnimationScrollInRecursion - delayScroll', delayScroll)

      let pxToScrollTop = 5
      if (delayScroll !== 0) {
        await timeout(delayScroll)
      } else {
        // на сколько пикселей двигается скролл при каждой рекурсии
        pxToScrollTop = 300
      }
      

      let scrollTopOld = document.querySelector('.simplebar-content-wrapper')
        .scrollTop
      document.querySelector('.simplebar-content-wrapper').scrollTop =
        pxToScrollTop + scrollTopOld
      let getCurrentScrollTop = document.querySelector(
        '.simplebar-content-wrapper'
      ).scrollTop


      let scrollElList = document.querySelectorAll(
        '.simplebar-track.simplebar-vertical'
      )
      let isShowScroll = false
      if (scrollElList.length === 2) {
        isShowScroll =
          scrollElList[1].style.visibility == 'visible' ? true : false
      }
      if (getCurrentScrollTop == scrollTopOld && isShowScroll) {
        // true - значит при нашем движении курсор уперся, значит это конечная точка
        // значит пока его переть дальше
        // clearTimeout(id);
        // console.log('first')
        return
      } else if (i > 50 && isShowScroll === false) {
        // завершаем если скролла еще нет, чтобы он не разгонялся на ровном месте
        // console.log('reset')
        return
      } else {
        // продолжаем переть скролл
        i = i + 0.5
        await AnimationScrollInRecursion(i, delayScroll)
      }
    }

    if (document.querySelectorAll('.chat-column').length > 1) {
      let delayScroll = 25

      if (checkCurrentMessageAsUsed(dialogs, i_forTimer) ) {
        delayScroll = 0
      }
      // console.log('delayScroll', delayScroll)

      AnimationScrollInRecursion(0, delayScroll)
    }

    markCurrentMessageAsUsed(dialogs, i_forTimer)
  }

  /**
   * задаем значение "для поля ввода"
   * @param {*} value 
   */
  setForSetter(value) {
    document.getElementById('setter').value =
      document.getElementById('setter').value + value
  }

  /**
   * задачем значение "полю каретки"
   */
  setForWriter() {
    document.querySelector('#writer').textContent = document.querySelector(
      '#setter'
    ).value
  }
  
  /**
   * очистка поля ввода
   */
  clearForSetter() {
    document.getElementById('setter').value = ''
  }
  
  /**
   * очистка поля каретки
   */
  clearForWriter() {
    document.querySelector('#writer').textContent = ''
  }

  /**
   * задает значение полю ввода
   * @param {*} value 
   */
  setForSetterOnly(value) {
    document.getElementById('setter').value = value
  }

  /**
   * отвечает за врешний вид симулирования поведения пользователя
   * (переписка, нажатия на кнопки(выбор вариантов), перенос текста на новую строку)
   * @param {*} a 
   * @param {*} text 
   * @param {*} timeTimeout 
   * @param {*} delay 
   */
  async chatinUserAnimation(a, text, timeTimeout, delay, dialogs, i_forTimer) {
    const timeout = (ms) =>
      new Promise((resolve) =>
        window.timerHub.setTimeout('chatinUserAnimation', resolve, ms)
      )

    // контроль зарежки перед печатью, печати, отправки сообщения
    if (a >= text.length) {
      await timeout(timeTimeout)
      this.clearForSetter()
      this.clearForWriter()
      document.querySelector('.cursor').classList.remove('cursorEnabled')
      document.querySelector('.sendText').style.opacity = '0.5'
      return
    } else if (a === 0) {

      if (checkCurrentMessageAsUsed(dialogs, i_forTimer) ) {
        delay = 0
      }

      await timeout(delay)
      timeTimeout = 100
    } else {
      await timeout(timeTimeout)
    }

    // eslint-disable-next-line prefer-const
    let sendText__value
    if (a === 0) {
      // если это 1й символ на внос, то проходим не трогаем value, так как там "placeholder"
      // ивируем анимацию привлечения внимания пользователя к полю ввода

      sendText__value = ''
    } else {
      // а если мы уже начала вводить текст в поле, то продолжаем комбинировать, чтобы получить итоговой ввод на данный момент
      sendText__value = document.querySelector('.sendText').value
    }

    if (text === 'Да' || text === 'Нет') {
      if (text === 'Да') {
        // когда мы ответам да (на выбор да.нет)
        const btn_option_choose = document.querySelectorAll('button.option_btn')
        console.log('btn_option_choose[btn_option_choose.length - 2]', btn_option_choose[btn_option_choose.length - 2])
        AddClass(btn_option_choose[btn_option_choose.length - 2], 'act_btn') // .length - 1 это НЕТ, а .length - 2 это ДА
        // add opacity current buttons
        AddClass(btn_option_choose[btn_option_choose.length - 1], 'opacity05')
        AddClass(btn_option_choose[btn_option_choose.length - 2], 'opacity05')
        a = text.length
      } else if (
        text === 'Нет'
      ) {
        // когда мы ответам да (на выбор да.нет)
        const btn_option_choose = document.querySelectorAll('button.option_btn')
        AddClass(btn_option_choose[btn_option_choose.length - 1], 'act_btn') // .length - 1 это НЕТ, а .length - 2 это ДА
        // add opacity current buttons
        AddClass(btn_option_choose[btn_option_choose.length - 1], 'opacity05')
        AddClass(btn_option_choose[btn_option_choose.length - 2], 'opacity05')
      }
    } else if (typeof text === 'object') {
      const btnOptionChooseList = document.querySelectorAll(
        'button.option_btn.choose.lasted'
      )
      let value = text[0]
      AddClass(btnOptionChooseList[value], 'act_btn')
      btnOptionChooseList.forEach((element) => {
        AddClass(element, 'opacity05')
      })
    } else {
      if (sendText__value + text[a] !== 'undefined') {
        // это плашечка от бага - (отображение в поле ввода undefined)
        // нормализация opacity и наличия пустоты в поле ввода нужна для 1го раза "ввода" в поле
        if (a === 0) {
          document.querySelector('.sendText').style.opacity = '0'
          localStorage.setItem('textHeigthForDetectNewLine', '0')
          localStorage.setItem(
            'textHeigthForDetectNewLine__numberCounterStartingSecondLine',
            '0'
          )
          localStorage.setItem(
            'textHeigthForDetectNewLine__numberCounterStartingThirdLine',
            '0'
          )

          // перевод поля с режима "placeholder" к режиму печати
          this.clearForSetter()
          this.clearForWriter()
          // показываем курсор
          document.querySelector('.cursor').classList.add('cursorEnabled')
        } else if (a === 1) {
          // eslint-disable-next-line prefer-const
          let getHeightTextInINput = document.querySelector('#writer')
            .offsetHeight
          localStorage.setItem(
            'textHeigthForDetectNewLine',
            getHeightTextInINput
          )
        } else {
          let getHeightTextInINput = document.querySelector('#writer')
            .offsetHeight
          let getHeightTextInINputLasted = localStorage.getItem(
            'textHeigthForDetectNewLine'
          )

          const getterWidth = document.querySelector('#getter').offsetWidth
          const setterWidth = document.querySelector('#writer').offsetWidth


          if (
            (setterWidth + 20) > getterWidth
          ) {
            let raznica =
              Number(getHeightTextInINput) - Number(getHeightTextInINputLasted)
            let lineHeigthThisLine = 20
            let lineHeigthAndPOGRESHNOST = 10
            let otlichitelnoeChislo =
              lineHeigthThisLine + lineHeigthAndPOGRESHNOST

            const countLocalStorage2 = localStorage.getItem(
                'textHeigthForDetectNewLine__numberCounterStartingSecondLine'
            )
            const countLocalStorage3 = localStorage.getItem(
                'textHeigthForDetectNewLine__numberCounterStartingThirdLine'
            )

            let CounerForRmSymbolsStr = Number(
                localStorage.getItem(
                    'textHeigthForDetectNewLine__numberCounterStartingSecondLine'
                )
            )
            let savedTxtInField = document.querySelector('#writer')
                .textContent
            let obrazanayaSrokaPoSimwoly = savedTxtInField.slice(
                CounerForRmSymbolsStr
            )
            this.setForSetterOnly(obrazanayaSrokaPoSimwoly.substring(1))
            this.setForWriter()

            if (raznica > otlichitelnoeChislo && countLocalStorage3 == '0' && false) {

            } else if (
              raznica > lineHeigthAndPOGRESHNOST &&
              countLocalStorage2 == '0'
            ) {
              // это 2я линия, и это первое назначение
              localStorage.setItem(
                'textHeigthForDetectNewLine__numberCounterStartingSecondLine',
                a
              )
            }
          }
        }
        this.setForSetter(text[a])
        this.setForWriter()
      }
    }

    // ГЛАВНОЕ УСЛОВИЕ
    if (a < text.length) {
      // УСЛОВИЕ НА ПРОДОЛЖЕНИЕ

      if (checkCurrentMessageAsUsed(dialogs, i_forTimer) ) {
        timeTimeout = 0
      }

      await this.chatinUserAnimation(++a, text, timeTimeout, delay, dialogs, i_forTimer)
    }
  }

  /**
   * подготавливает(собирает) и "отправляет"
   * сообщение от пользователя
   * @param {*} a 
   * @param {*} text 
   * @param {*} timeTimeout 
   * @param {*} delay 
   * @param {*} dialogs 
   * @param {*} i_forTimer 
   * @param {*} description 
   * @param {*} simplebar 
   */
  async preBuildMessageUser(
    a,
    text,
    timeTimeout,
    delay,
    dialogs,
    i_forTimer,
    description,
    simplebar
  ) {
    const timeout = (ms) =>
      new Promise((resolve) =>
        window.timerHub.setTimeout('preBuildMessageUser', resolve, ms)
      )
    const vm = this
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {

      

      // console.log('!checkCurrentMessageAsUsed(dialogs, i_forTimer)', !checkCurrentMessageAsUsed(dialogs, i_forTimer))
      // console.log('delay timeoutBeforeSendMessage', {
      //   timeoutBeforeSendMessage: timeoutBeforeSendMessage,
      //   delay: delay
      // })


      // ГЛАВНОЕ УСЛОВИЕ
      if (a >= text.length) {

        let timeoutBeforeSendMessage = 100

        if (!checkCurrentMessageAsUsed(dialogs, i_forTimer)) {
          if(localStorage.getItem('web_first_part_user_msg') ) {
            localStorage.removeItem('web_first_part_user_msg')
            // markCurrentMessageAsUsed(dialogs, i_forTimer)
          }
          localStorage.setItem('web_first_part_user_msg', 'true')
        } else {
          timeoutBeforeSendMessage = 0
          delay = 0
        }

        // ЗАПОЛНИЛИ ЛИ МЫ ПОЛЕ? - ДА
        await timeout(timeoutBeforeSendMessage)
        timeTimeout = delay // задережка в показе сообщения(приложение думает)
        var text_dialog
        if (typeof dialogs[i_forTimer].text === 'object') {
          const btnOptionChooseList = document.querySelectorAll(
            'button.option_btn.choose.lasted'
          )
          let preTextDialog =
            btnOptionChooseList[dialogs[i_forTimer].text[0]].textContent
          text_dialog = preTextDialog.substr(preTextDialog.indexOf(' ') + 1) // убираем порядковый номирок у варианта списка и отдаем чисты текст
        } else {
          text_dialog = dialogs[i_forTimer].text
        }
        var from = dialogs[i_forTimer].from,
          icon_src = dialogs[i_forTimer].icon, // icon src
          time = dialogs[i_forTimer].time,
          options = dialogs[i_forTimer].options
        // debugger
        new Chating().buildMessage(
          from,
          text_dialog,
          time,
          options,
          delay,
          dialogs,
          i_forTimer
        )
      } else {

        let timeoutBeforeSendMessage = 100

        if (!checkCurrentMessageAsUsed(dialogs, i_forTimer) ) {
          // markCurrentMessageAsUsed(dialogs, i_forTimer)
        } else {
          timeoutBeforeSendMessage = 0
          delay = 0
        }

        // ЗАПОЛНИЛИ ЛИ МЫ ПОЛЕ - НЕТ
        await vm.chatinUserAnimation(a, text, timeTimeout, delay, dialogs, i_forTimer)
        console.log('before preBuildMessageUser')
        await vm.preBuildMessageUser(
          (a = text.length),
          text,
          timeTimeout,
          delay,
          dialogs,
          i_forTimer,
          description,
          simplebar
        )
      }
      resolve()
    }) // promise
  }

  /**
   * подготавливает(собирает) и "отправляет"
   * сообщение от приложения
   * @param {*} text 
   * @param {*} timeTimeout 
   * @param {*} delay 
   * @param {*} dialogs 
   * @param {*} i_forTimer 
   * @param {*} description 
   * @param {*} simplebar 
   */
  async preBuildMessageApp(
    text,
    timeTimeout,
    delay,
    dialogs,
    i_forTimer,
    description,
    simplebar
  ) {
    const timeout = (ms) =>
      new Promise((resolve) =>
        window.timerHub.setTimeout('preBuildMessageApp', resolve, ms)
      )

    // if (!checkCurrentMessageAsUsed(dialogs, i_forTimer) ) {
    //   markCurrentMessageAsUsed(dialogs, i_forTimer)
    // } else {
    //   delay = 0
    // }
    if (!checkCurrentMessageAsUsed(dialogs, i_forTimer)) {
      if(localStorage.getItem('web_first_part_app_msg') ) {
        localStorage.removeItem('web_first_part_app_msg')
        // markCurrentMessageAsUsed(dialogs, i_forTimer)
      }
      localStorage.setItem('web_first_part_app_msg', 'true')
    } else {
      delay = 0
    }
      
    timeTimeout = delay
    await timeout(timeTimeout)

    const text_dialog = dialogs[i_forTimer].text,
      from = dialogs[i_forTimer].from,
      icon_src = dialogs[i_forTimer].icon, // icon src
      time = dialogs[i_forTimer].time,
      options = dialogs[i_forTimer].options

    new Chating().buildMessage(
      from,
      text_dialog,
      time,
      options,
      delay,
      dialogs,
      i_forTimer
    )

    return
  }

  /**
   * создает цикл выставления("отправки") сообщений
   * (т.е. цикл самой переписки)
   * @param {*} argsDialogs 
   */
  CreateAnimationChating(argsDialogs) {
    const dialogs = argsDialogs

    var simplebar = this.simplebar,
      a = 0, // for letters
      timeTimeout = 0
    const vm = this

    var timerFunc = (i_forTimer) => {
      return async () => {
        if (i_forTimer >= dialogs.length) {
          this.addScroollToBottomBtn() // btn
          this.addEventOnScrollFromBottomAfterChatingAnimation() // event
          // включаем возможность скролла чата
          new this.ControlChatScrollEvent().enableScroll(
            document.getElementById('chatContent')
          )
          return
        } else if (i_forTimer == 0) {
          // отключаем скролл чата,чтобы юзер не мог скролить верх, и тем самым дрыгать анимацию,
          // чтобы анимация проработала плавно для него
          new this.ControlChatScrollEvent().disableScroll(
            document.getElementById('chatContent')
          )
        }

        // если мы трансформаровались с другой анимации, то скрываем поле ввода, на момент проктурки всех сообщений
        if (checkCurrentMessageAsUsed(dialogs, i_forTimer)) {
          document.querySelector('#getter').style.display = 'none'
        } else {
          document.querySelector('#getter').style.display = 'flex';
        }



        // ТЕЛО
        console.log('turn no. ' + i_forTimer)
        var text = null

        text = dialogs[i_forTimer].text
        var description = dialogs[i_forTimer].descr
        let fullTimeMessage = dialogs[i_forTimer].time
        let time = fullTimeMessage.substring(
          fullTimeMessage.lastIndexOf(' ') + 1
        )

        // задержка появления сообщения
        var delay = dialogs[i_forTimer].delay

        // убираем возможность скролла чата при действии анимации(чтобы если юзер будет скроллить оно не дрыгалось)

        // eslint-disable-next-line prefer-const

        let who = dialogs[i_forTimer].from
        if (who === 'user') {
          console.log('before preBuildMessageUser2')
          await vm.preBuildMessageUser(
            a,
            text,
            timeTimeout,
            delay,
            dialogs,
            i_forTimer,
            description,
            simplebar
          )
        } else if (who === 'app') {
          await vm.preBuildMessageApp(
            text,
            timeTimeout,
            delay,
            dialogs,
            i_forTimer,
            description,
            simplebar
          )
        }
        a = 0
        // ставим если нужно новое время у телефона(берем уго у сообщения)

        if (i_forTimer < dialogs.length) {
          // УСЛОВИЕ НА ПРОДОЛЖЕНИЕ
          setTimeout(timerFunc(++i_forTimer), 0)
        }
      }
    }

    setTimeout(timerFunc(0), 0) // самый первый запуск цикла анимации чатинга(переписки) на setTimout-ах
  }

  /**
   * определеяет когда нужно показывать, а когда скрывать
   * кнопку прокрутки самому последнему сообщению
   * и
   * ставит событие клика на эту кнопку
   * и вслучаи его срабатывания
   * делает скролл к самому последнему сообщению в диалоге
   */
  addEventOnScrollFromBottomAfterChatingAnimation() {
    var self = this
    ;(function () {
      const simpleBar = self.simplebar
      // console.log(simpleBar)
      // console.log(simpleBar.getScrollElement())

      // event on scroll
      simpleBar.getScrollElement().addEventListener('scroll', () => {
        let maxScrollTop =
          simpleBar.getScrollElement().scrollHeight -
          simpleBar.getScrollElement().offsetHeight
        let scrollTop = simpleBar.getScrollElement().scrollTop
        // console.log('---------------')
        // console.log('scrollTop = ' + scrollTop)
        // console.log(
        //   'scrollHeight = ' + simpleBar.getScrollElement().scrollHeight
        // )
        // console.log(
        //   'offsetHeight = ' + simpleBar.getScrollElement().offsetHeight
        // )
        // console.log('maxScrollTop = ' + maxScrollTop)

        if (scrollTop == maxScrollTop) {
          // мы прокрученом состоянии до конца
          // console.log('hideSrollToBottomBtn')
          self.hideSrollToBottomBtn()
        } else {
          // console.log('showSrollToBottomBtn')
          self.showSrollToBottomBtn()
        }
      })

      // event on click on button scroll
      document
        .querySelector('.ScrollToBottom')
        .addEventListener('click', () => {
          simpleBar.getScrollElement().scrollTop =
            simpleBar.getScrollElement().scrollHeight -
            simpleBar.getScrollElement().offsetHeight
        })
    })(self)
  }

  /**
   * создаем кнопку прокурутки скролла вниз к самому новому сообщению
   * срабатывает в случаи окончания анимации переписки, когда разблокируется скролл по ней
   * и юзер пролистал переписку вверх(в сторону первых сообщений)
   */
  addScroollToBottomBtn() {
    // container
    const container = document.createElement('div')
    container.classList.add('ScrollToBottom')
    // image
    const image = document.createElement('img')
    image.classList.add('ScrollToBottom__img')
    image.setAttribute('src', './chats/assets/img/icons/transparent/okNorm.svg')
    // append imge in container
    container.appendChild(image)
    // add to chat container
    document.getElementById('chatContent').appendChild(container)
  }

  /**
   * делаем кнопку скролла к новым сообщениям скрытой
   */
  hideSrollToBottomBtn() {
    document.querySelector('.ScrollToBottom').style.visibility = 'hidden'
  }

  /**
   * делаем кнопку скролла к новым сообщениям видимой
   */
  showSrollToBottomBtn() {
    document.querySelector('.ScrollToBottom').style.visibility = 'visible'
  }
}
