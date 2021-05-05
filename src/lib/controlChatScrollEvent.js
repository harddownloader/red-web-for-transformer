 
/**
 * class for control chat scroll event
 */
export class ControlChatScrollEvent {
  constructor() {
      // left: 37, up: 38, right: 39, down: 40,
      // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
      this.keys = {37: 1, 38: 1, 39: 1, 40: 1};

      // modern Chrome requires { passive: false } when adding event
      this.supportsPassive = false;

      this.wheelOpt = this.supportsPassive ? { passive: false } : false;
      this.wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

      try {
          window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { this.supportsPassive = true; }
          }));
      } catch(e) {}
  }

  /**
   * set preventDefault
   * @param {*} e 
   */
  preventDefault(e) {
      e.preventDefault();
  }

  /**
   * preventDefault for scroll keys
   * @param {*} e 
   */
  preventDefaultForScrollKeys(e) {
      if (this.keys[e.keyCode]) {
          preventDefault(e);
          return false;
      }
  }

  /**
   * call this to Disable
   * @param {*} el 
   */
  disableScroll(el) {
      el.addEventListener('DOMMouseScroll', this.preventDefault, false); // older FF
      el.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); // modern desktop
      el.addEventListener('touchmove', this.preventDefault, this.wheelOpt); // mobile
      el.addEventListener('keydown', this.preventDefaultForScrollKeys, false);
  }

  /**
   * call this to Enable
   * @param {*} el 
   */
  enableScroll(el) {
      el.removeEventListener('DOMMouseScroll', this.preventDefault, false);
      el.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
      el.removeEventListener('touchmove', this.preventDefault, this.wheelOpt);
      el.removeEventListener('keydown', this.preventDefaultForScrollKeys, false);
  }
}
