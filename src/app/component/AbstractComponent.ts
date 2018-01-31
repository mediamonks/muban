import camelCase from 'lodash/camelCase';

export default class AbstractComponent {
  protected data: { [key: string]: string };

  constructor(public element: HTMLElement) {
    this.data = Object.values(element.attributes)
      .filter(attribute => attribute.nodeName.includes('data-'))
      .reduce(
        (accumulator, attribute) => ({
          ...accumulator,
          [camelCase(attribute.nodeName.replace(/^data-/, ''))]: attribute.value,
        }),
        {},
      );
  }

  dispose() {
    this.element = null;
    this.data = null;
  }
}
