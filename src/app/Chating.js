/* eslint-disable prefer-const */
import SimpleBar from 'simplebar'
import 'simplebar/dist/simplebar.css'

import { AddClass } from '../lib/classControl'
import { FX } from '../lib/fadeInFadeOut'
import { BuildPhone } from './Builder'

import '../lib/timerHub' // чтобы мочь застопить все анимации если нужно закрыть окно
import { ControlChatScrollEvent } from '../lib/controlChatScrollEvent'

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
        '<div class="chat-icon"><img width="30" src="assets/img/logo.png"></div>\n' +
        '</div>'
    } else if (typeSet == 'company') {
      // is user
      AppIcon =
        '<div class="item">\n' +
        '<div class="chat-icon">\n' +
          '<picture>\n' +
          '<source srcset="assets/img/userAvatar2_red.webp" type="image/webp">\n' +
          '<source srcset="assets/img/userAvatar2_red.png" type="image/png"> \n' +
          '<img src="assets/img/userAvatar2_red.png" width="25px">\n' +
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
            '<div class="grid">' +
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
            '<span>266</span>' +
            '<span>Оплачен</span>' +
            '<span>18.06.2020</span>' +
            '<span>20250.00</span>' +
            '<span>RUB</span>' +
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

    var count = chat_columns.length - 1
    new FX().fadeIn(chat_columns[count], {
      duration: 1000,
      complete: function () {
        // console.log('Complete')
      },
    })

    if (options_html_container != '') {
      msg_list[0].appendChild(options_html_container)
      var options_wrapper = document.querySelectorAll('.options_wrapper')
      new FX().fadeIn(options_wrapper[options_wrapper.length - 1], {
        duration: 1000,
        complete: function () {
          // console.log('Complete')
        },
      })
    }

    document.querySelector('.sendText').value = ''
    new BuildPhone().setInputField() // ставим "placeholder" полю ввода

    // Scroll
    async function AnimationScrollInRecursion(i) {
      const timeout = (ms) =>
        new Promise((resolve) =>
          window.timerHub.setTimeout('preBuildMessageApp', resolve, ms)
        )

      await timeout(25)

      let scrollTopOld = document.querySelector('.simplebar-content-wrapper')
        .scrollTop
      document.querySelector('.simplebar-content-wrapper').scrollTop =
        5 + scrollTopOld
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
        console.log('first')
        return
      } else if (i > 50 && isShowScroll === false) {
        // завершаем если скролла еще нет, чтобы он не разгонялся на ровном месте
        // console.log('reset')
        return
      } else {
        // продолжаем переть скролл
        i = i + 0.5
        await AnimationScrollInRecursion(i)
      }
    }

    if (document.querySelectorAll('.chat-column').length > 1) {
      AnimationScrollInRecursion(0)
    }
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
  async chatinUserAnimation(a, text, timeTimeout, delay) {
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
      // делаем так чтобы юзер мог просто ответить "нет" (т.е. нет не как ответ на вопрос да/нет)
      let lastElementInList__class = document.querySelector(
        '.chatContentWrapper'
      ).lastChild.classList
      if (text === 'Да' && lastElementInList__class === 'options_wrapper') {
        // когда мы ответам да (на выбор да.нет)
        const btn_option_choose = document.querySelectorAll('button.option_btn')
        AddClass(btn_option_choose[btn_option_choose.length - 2], 'act_btn') // .length - 1 это НЕТ, а .length - 2 это ДА
        // add opacity current buttons
        AddClass(btn_option_choose[btn_option_choose.length - 1], 'opacity05')
        AddClass(btn_option_choose[btn_option_choose.length - 2], 'opacity05')
        a = text.length
      } else if (
        text === 'Нет' &&
        lastElementInList__class === 'options_wrapper'
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
          if (
            getHeightTextInINput != getHeightTextInINputLasted &&
            getHeightTextInINput > getHeightTextInINputLasted
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

            if (raznica > otlichitelnoeChislo && countLocalStorage3 == '0') {
              // то это 3й цикл( так как на 1м 2числа равны,2м разница около 20, 3м около 40)
              let CounerForRmSymbolsStr = Number(
                localStorage.getItem(
                  'textHeigthForDetectNewLine__numberCounterStartingSecondLine'
                )
              )
              let savedTxtInField = document.querySelector('#writer')
                .textContent
              // console.log(savedTxtInField.slice(CounerForRmSymbolsStr))

              let obrazanayaSrokaPoSimwoly = savedTxtInField.slice(
                CounerForRmSymbolsStr
              )
              // обрезаем строку , по символу , который мы зпомнили
              // то что получилось режим с общим предложением , чтобы получить 1ю часть предложения(до обрезки части предложения)
              // после мы находим послений пробел в этой части и то ,что за ним (т.е. кусок слова , об которое мы поделили предложение на 2 части в 1й раз)
              // вот это слово мы и добавляем к 2й части предложения (которую мы отрезали)
              // выходит если мы порезали преложение на каком либо слове, то мы находим недостающюю часть этого слова и плюсуем к той что нужно вывести
              // итого мы перегосим слово целиком , а не его фрагмент
              let needWordPart = savedTxtInField
                .split(obrazanayaSrokaPoSimwoly)[0]
                .substr(
                  savedTxtInField
                    .split(obrazanayaSrokaPoSimwoly)[0]
                    .lastIndexOf(' ') + 1
                )
              let needWords =
                needWordPart + savedTxtInField.slice(CounerForRmSymbolsStr)
              console.log(needWords)

              this.setForSetterOnly(needWords)
              this.setForWriter()
              // мечаем что мы тут были
              localStorage.setItem(
                'textHeigthForDetectNewLine__numberCounterStartingThirdLine',
                '1'
              )
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
      await this.chatinUserAnimation(++a, text, timeTimeout, delay)
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
      // ГЛАВНОЕ УСЛОВИЕ
      if (a >= text.length) {
        // ЗАПОЛНИЛИ ЛИ МЫ ПОЛЕ? - ДА
        await timeout(100)
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

        new Chating().buildMessage(
          from,
          text_dialog,
          time,
          options,
        )
      } else {
        // ЗАПОЛНИЛИ ЛИ МЫ ПОЛЕ - НЕТ
        await vm.chatinUserAnimation(a, text, timeTimeout, delay)
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
    image.setAttribute('src', './assets/img/icons/transparent/okNorm.svg')
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
