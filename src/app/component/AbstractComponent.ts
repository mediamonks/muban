import camelCase from 'lodash/camelCase';

export default class AbstractComponent {
  protected data: { [key: string]: string };

  constructor(public element: HTMLElement) {
    this.data = Object.values(element.attributes)
      .filter(attribute => attribute.nodeName.startsWith('data-'))
      .reduce(
        (accumulator, attribute) => ({
          ...accumulator,
          [camelCase(attribute.nodeName.replace(/^data-/, ''))]: attribute.value,
        }),
        {},
      );
  }

  /**
   * @public
   * @method getElement
   * @param {string} selector
   * @param {HTMLElement} container
   * @returns {HTMLElement}
   */
  public getElement(selector: string, container: HTMLElement = this.element): HTMLElement {
    return <HTMLElement>container.querySelector(selector);
  }

  /**
   * @public
   * @method getElements
   * @param {string} selector
   * @param {HTMLElement} container
   * @returns {Array<HTMLElement>}
   */
  public getElements(selector: string, container: HTMLElement = this.element): Array<HTMLElement> {
    return <Array<HTMLElement>>Array.from(container.querySelectorAll(selector));
  }

  dispose() {
    this.element = null;
    this.data = null;
  }
}
