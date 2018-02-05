import AbstractComponent from 'app/component/AbstractComponent';

declare function require(name: string): string;

/**
 * Note: Please be aware that all svg icons in the folder "app/svg/*.svg"
 * will be included in your final bundle.js, so leave out all unused svg
 * icons to keep your bundle as small as possible!
 *
 * Example usage:
 *
 * ```html
 * {{> general/icon name="logo-gap" }}
 * ```
 */
export default class Icon extends AbstractComponent {
  static displayName: string = 'icon';

  constructor(el: HTMLElement) {
    super(el);

    el.innerHTML = require(`app/svg/icon/${this.data.icon}.svg`);
  }
}
