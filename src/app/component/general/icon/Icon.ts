import AbstractComponent from 'app/component/AbstractComponent';

// declare var require:any;

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);

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

    this.element.innerHTML = svgContext(`./${this.element.dataset.icon}.svg`);
  }

  public setIcon(name: string): void {
    this.element.innerHTML = svgContext(`./${name}.svg`);
  }
}
