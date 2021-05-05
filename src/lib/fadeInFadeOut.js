/* eslint no-constant-condition: "off" */

/**
 * 
 * класс, который хранит виды анимаций
 */
class Easing {
  linear(progress) {
    return progress
  }
  quadratic(progress) {
    return Math.pow(progress, 2)
  }
  swing(progress) {
    return 0.5 - Math.cos(progress * Math.PI) / 2
  }
  circ(progress) {
    return 1 - Math.sin(Math.acos(progress))
  }
  back(progress, x) {
    return Math.pow(progress, 2) * ((x + 1) * progress - x)
  }
  bounce(progress) {
    for (var a = 0, b = 1; 1; a += b, b /= 2) {
      if (progress >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
      }
    }
  }
  elastic(progress, x) {
    return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress)
  }
}

/**
 * class for use fadeIn() and fadeOut() without jQuery, only vanilla js
 */
export class FX extends Easing {
  constructor() {
    super()
  }

  /**
   * создает саму механику сокрытия/отображения элемента для 
   * функций сокрытия и отображения
   * @param {*} options 
   */
  animate(options) {
    var start = new Date
    var id = setInterval(function() {
      var timePassed = new Date - start
      var progress = timePassed / options.duration
      if (progress > 1) {
        progress = 1
      }
      options.progress = progress
      var delta = options.delta(progress)
      options.step(delta)
      if (progress == 1) {
        clearInterval(id)
        options.complete()
      }
    }, options.delay || 10)
  }
  /**
   * для сокрытия элемента
   * @param {*} element 
   * @param {*} options 
   */
  fadeOut(element, options) {
    var to = 1
    this.animate({
      duration: options.duration,
      delta: function(progress) {
        progress = this.progress
        return FX.prototype.swing(progress)
      },
      complete: options.complete,
      step: function(delta) {
        element.style.opacity = to - delta
      }
    })
  }
  /**
   * для отображения элемента
   * @param {*} element 
   * @param {*} options 
   */
  fadeIn(element, options) {
    var to = 0
    this.animate({
      duration: options.duration,
      delta: function(progress) {
        progress = this.progress
        
        return FX.prototype.swing(progress)
      },
      complete: options.complete,
      step: function(delta) {
        element.style.opacity = to + delta
      }
    })
  }
}
