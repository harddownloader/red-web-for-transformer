// babel
import 'core-js';
import 'regenerator-runtime/runtime';
// app
import { Chating } from './app/Chating' // на постройку механики обмена сообщениями
import { getWebHtml } from './app/createHTML'

// normalize
import('normalize.css/normalize.css')
// bootstrap 4.5 css
import('bootstrap/dist/css/bootstrap.min.css')
// подрубаем стили на stylus-е
require('./styles/stylus/main.styl')
;(function () {
  /**
   * класс инициализации самой анимации
   */
  window.RedWebAnimation = class WebAdminAnimation {
    constructor(args) {
      // ставим события клика на все элементы
      this.setClickEventWebAnim(args.idElement)

      this.dialogs = args.dialogs
      this.args = args

      // ставим номер анимации (чтобы можно было узнать сколько их)
      WebAdminAnimation.numInstances = (WebAdminAnimation.numInstances || 0) + 1
      this.numInstances = WebAdminAnimation.numInstances

      this.argsForBuilder = {
        type: args.type || 0, // тип анимации, отвеч. за отображение анимации ввода юзера

        dateChatingInHeader: args.dateChatingInHeader,
        headingChat: args.headingChat,
        dateTime: args.dateTime,
        clock: args.clock,
      }
      this.type = args.type || 0
    }

    /**
     * делаем стили(link в html) действующими на странице
     * для более удобно мержда с другими анимациями
     * нужно просто расскоментить вызовы этих функций ниже, чтобы их файлы стилей то включались
     * то выключались с страницы
     * @param {*} name 
     */
    activateStyles(name = 'linkRedWeb') {
      document
        .querySelector(`link[data-id=${name}]`)
        .removeAttribute('disabled')
    }

    /**
     * делаем стили(link в html) бездействующими на странице
     * @param {*} name 
     */
    deactivateStyles(name = 'linkRedWeb') {
      document
        .querySelector(`link[data-id=${name}]`)
        .setAttribute('disabled', '')
    }

    /**
     * проверяет загрузилась ли страничка
     * @param {*} callback 
     */
    ready(callback) {
      if (document.readyState != 'loading') callback()
      else document.addEventListener('DOMContentLoaded', callback)
    }

    /**
     * если не проставили значек айдишника, то ставим его
     * и вызываем функцию добавления слушателя клика на этот id(для запуска анимации)
     * @param {*} elementID 
     */
    setClickEventWebAnim(elementID) {
      if (elementID[0] != '#') {
        // если не проставили значек айдишника, то ставим его
        elementID = '#' + elementID
      }
      this.startChatListenerWebAnim(elementID)
    }

    /**
     * ставит событие клика на нужный id
     * @param {*} elementID 
     */
    startChatListenerWebAnim(elementID) {
      // когда кликаем по иконке нашей анимации (для ее старта)
      document.querySelector(elementID).addEventListener('click', (event) => {
        event.stopPropagation() // это экспериментальная , можно удалять
        this.startChatWebAnim(elementID)
      })
    }

    /**
     * ставит условие, что нужно сделать если произошел клик по нужному id
     * @param {*} elementID 
     */
    startChatWebAnim(elementID) {
      this.ready(async () => {
        // this.activateStyles()
        // чтобы не было дублей события старта при множественных кликах
        document.querySelector(elementID).style.pointerEvents = 'none';
        await this.setBodyOverflow('hidden')
        // вставляем html самой анимации в DOM
        await this.addHtmlAnimationInMainContainer()
        // делаем анимацию видимой
        await this.setChatVisible()

        // ставим слушателя на уничтожение
        await this.destroyChatClickListenerWebAnim(elementID)

        if (!localStorage.getItem('currentAnimationDialog')) {
          localStorage.setItem('currentAnimationDialog', JSON.stringify(this.dialogs))
        }

        await new Chating().CreateAnimationChating(this.dialogs)
      })
    }

    /**
     * вставляем html самой анимации в DOM
     */
    async addHtmlAnimationInMainContainer() {
      const htmlWebAdminAnimation = await getWebHtml()
      document.body.insertAdjacentHTML('beforeend', htmlWebAdminAnimation)
      // console.log('html insered')
    }

    /**
     * удаляем html анимации из DOM
     */
    removeHtmlAnimationFromMainContainer() {
      document.body.removeChild(document.getElementById('master-container'))
    }

    /**
     * делаем анимацию видимой
     */
    setChatVisible() {
      document.querySelector('#chat-box').style.display = 'block'
    }

    /**
     * уничтожаем чат
     * если кликаем по контейнеру вокруг телефона(т.е. в любое место ,только не на телефон), то закрываться анимация
     * @param {*} elementID 
     */
    destroyChatClickListenerWebAnim(elementID) {
      // если кликаем по контейнеру вокруг телефона(т.е. в любое место ,только не на телефон), то закрываться анимация
      document.getElementById('chat-box').addEventListener('click', (event) => {
        event.stopPropagation()
        if (this.isOutSideContainer(event.target.id)) {
          this.destroyChatWebAnim(elementID)
        }
      })
    }

    /**
     * проверяем был ли этот клик за пределами анимации(т.е. не по анимации, а по ее фону)
     * @param {*} idEl 
     */
    isOutSideContainer(idEl) {
      if (idEl === 'chat-box-content') {
        return true
      } else {
        return false
      }
    }

    /**
     * очистка поля ввода(1часть)
     */
    clearForSetter() {
      document.getElementById('setter').value = ''
    }

    /**
     * очистка поля ввода(2часть)
     */
    clearForWriter() {
      document.querySelector('#writer').textContent = ''
    }

    /**
     * полная очистка поля ввода
     */
    clearUserInput() {
      this.clearForSetter()
      this.clearForWriter()
      document.querySelector('.cursor').classList.remove('cursorEnabled')
      document.querySelector('.sendText').style.opacity = '0.5'
    }

    /**
     * выключает анимацию
     * (делает выход из анимации, если был произведен клик за пределами анимации)
     * @param {*} elementID 
     */
    destroyChatWebAnim(elementID) {
      // чтобы не было дублей события старта при множественных кликах
      document.querySelector(elementID).style.pointerEvents = 'auto';
      // this.deactivateStyles()
      this.setBodyOverflow('visible')
      this.StopAllChatAnimations()
      document.getElementById('chat-box').style.display = 'none' // скрываем контейнер анимации
      this.removeHtmlAnimationFromMainContainer() // удаляем html анимации из DOM
      // тута все уничтожаем
    }

    /**
     * стопорит все таймауты
     */
    StopAllChatAnimations() {
      window.timerHub.stop('chatinUserAnimation')
      window.timerHub.stop('preBuildMessageApp')
      window.timerHub.stop('preBuildMessageUser')
    }

    /**
     * чтобы нельзя было гонять скролл по веб-странице в момент анимации (это фикс белой полоски внизу экрана при анимации , тип что оверлей все не может покрыть , еси скролл включен)
     * @param {*} value - значение для overflow , может быть visible или hidden
     */
    setBodyOverflow(value) {
      document.querySelector('body').style.overflow = value
    }
  } // WebAdminAnimation
})()
