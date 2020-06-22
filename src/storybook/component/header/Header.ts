import $ from 'jquery';
import ko from 'knockout';
import AbstractComponent from 'app/component/AbstractComponent';
import model from '../../model';

export default class Header extends AbstractComponent {
  static displayName: string = 'storybook-header';

  private searchInput: HTMLInputElement;
  private searchResults: Element;

  private searchOpened: KnockoutObservable<boolean> = ko.observable(false);

  constructor(el: HTMLElement) {
    super(el);

    this.searchInput = el.querySelector('input');
    this.searchInput.addEventListener('focus', this.onSearchFocus);
    this.searchInput.addEventListener('blur', this.onSearchBlur);

    this.searchResults = el.querySelector('.search-results');

    $('.device-emulator', this.element).on('click', this.onDeviceClick);

    ko.applyBindingsToNode(this.searchResults, {
      css: { opened: this.searchOpened },
    });

    ko.applyBindingsToNode($(`.header-nav li.device-emulator`)[0], {
      css: { selected: model.deviceEmulateEnabled },
    });

    // hack for fade-in-on-load css issue
    setTimeout(() => {
      this.searchResults.classList.add('active');
    }, 500);
  }

  private onDeviceClick = () => {
    model.deviceEmulateEnabled(!model.deviceEmulateEnabled());
  };

  private onSearchFocus = () => {
    this.searchOpened(true);
    document.addEventListener('keyup', this.onKeyUp);
  };
  private onSearchBlur = () => {
    this.searchOpened(false);
    document.removeEventListener('keyup', this.onKeyUp);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 27: // ESC
        this.searchInput.blur();
        this.onSearchBlur();
    }
  };

  private setViewportSize(newSize) {
    const sizes = {
      xs: 360,
      s: 480,
      m: 768,
      l: 1024,
      xl: 1200,
    };

    $(document.querySelector('.content')).css('max-width', sizes[newSize]);

    $('.header-nav li', this.element).removeClass('selected');
    $(`.header-nav li.size-${newSize}`).addClass('selected');
  }

  public dispose() {
    this.searchInput.addEventListener('focus', this.onSearchFocus);
    this.searchInput.addEventListener('blur', this.onSearchBlur);
    $(this.searchResults).off('click');
    $('.device-emulator', this.element).off('click', this.onDeviceClick);

    this.searchInput = null;

    super.dispose();
  }
}
