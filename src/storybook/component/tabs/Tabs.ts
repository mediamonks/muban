import { CoreComponent } from 'muban-core';

export default class Tabs extends CoreComponent {
  static displayName: string = 'tabs';

  private tabs: Array<HTMLLIElement>;
  private tabId: string;
  private tabContainers: Array<Element>;
  private contentMore: HTMLParagraphElement;

  constructor(el: HTMLElement) {
    super(el);

    this.tabId = this.element.getAttribute('data-tab-id');
    this.tabs = Array.from(this.element.querySelectorAll('li'));
    this.tabContainers = Array.from(document.querySelectorAll(`[data-tab="${this.tabId}"]`));

    for (const tab of this.tabs) {
      tab.addEventListener('click', this.onTabClick);
    }

    this.selectTab(0);
  }

  private onTabClick = event => {
    const selectedIndex = this.tabs.indexOf(event.target);

    this.selectTab(selectedIndex);
  };

  public selectTab(selectedIndex: number) {
    this.tabContainers.forEach((tabContainer, index) => {
      index === selectedIndex
        ? tabContainer.classList.remove('hidden')
        : tabContainer.classList.add('hidden');
    });

    this.tabs.forEach((tab, index) => {
      index === selectedIndex ? tab.classList.add('selected') : tab.classList.remove('selected');
    });
  }

  public dispose() {
    for (const tab of this.tabs) {
      tab.removeEventListener('click', this.onTabClick);
    }
    this.tabs = null;
    this.tabContainers = null;

    super.dispose();
  }
}
