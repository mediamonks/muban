import AbstractComponent from '../AbstractComponent';

export default class AbstractBlock extends AbstractComponent {
  constructor(public element: HTMLElement) {
    super(element);
  }
}
