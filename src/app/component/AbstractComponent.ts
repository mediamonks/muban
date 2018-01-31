import camelCase from 'lodash/camelCase';

export default class AbstractComponent {
  protected data: { [key: string]: string };

  constructor(public element: HTMLElement) {
    this.data = Object.values(element.attributes)
      .map(attribute => ({ name: attribute.nodeName, value: attribute.value }))
      .filter(node => node.name.includes('data-'))
      .reduce(
        (accumulator, node) => ({
          ...accumulator,
          [camelCase(node.name.replace(/^data-/, ''))]: node.value,
        }),
        {},
      );
  }

  dispose() {
    this.element = null;
    this.data = null;
  }
}
