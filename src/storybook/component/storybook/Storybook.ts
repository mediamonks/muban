import $ from 'jquery';
import ko from 'knockout';
import { CoreComponent } from 'muban-core';
import model from '../../model';

const RESIZER_WIDTH = 13;

export default class Storybook extends CoreComponent {
  static displayName: string = 'storybook';

  private offsetX: number;
  private isBefore: boolean;
  private content: Element;

  constructor(el: HTMLElement) {
    super(el);

    this.content = document.querySelector('.content');
    $('.resizer', el).on('mousedown', this.onMouseDown);

    $('.settings .generic', this.element).on('click', '.size', this.onSizeClick);

    $('.settings .bar', this.element).on('click', this.onMediaBarClick);

    ko.applyBindingsToNode($('body')[0], {
      css: { 'device-emulator': model.deviceEmulateEnabled },
    });

    ko.applyBindingAccessorsToNode(
      this.content,
      {
        style: () => ({
          maxWidth: model.deviceEmulateEnabled() ? model.viewportWidth() + 'px' : '100%',
        }),
        css: () => ({ resizing: model.isResizingViewport }),
      },
      {},
    );

    ko.applyBindingAccessorsToNode(
      $('.current-size .value')[0],
      {
        text: () => (model.deviceEmulateEnabled() ? model.viewportWidth() + 'px' : '100%'),
      },
      {},
    );

    $('.bar')
      .toArray()
      .forEach(bar => {
        ko.applyBindingAccessorsToNode(
          bar,
          {
            css: () => {
              let min: any = bar.getAttribute('data-size-min');
              let max: any = bar.getAttribute('data-size-max');
              min = min === '*' ? min : parseInt(min, 10);
              max = max === '*' ? max : parseInt(max, 10);

              return {
                active:
                  (model.viewportWidth() >= min || min === '*') &&
                  (model.viewportWidth() <= max || max === '*'),
              };
            },
          },
          {},
        );
      });
  }

  private onMediaBarClick = event => {
    const type = event.currentTarget.getAttribute('data-size-type');
    const min = parseInt(event.currentTarget.getAttribute('data-size-min'), 10);
    const max = parseInt(event.currentTarget.getAttribute('data-size-max'), 10);
    const currentWidth = model.viewportWidth();
    let newWidth = currentWidth;

    if (type === 'max') {
      newWidth = max;
    }
    if (type === 'min') {
      newWidth = min;
    }
    if (type === 'min-max') {
      if (min === currentWidth) {
        newWidth = max;
      } else {
        newWidth = min;
      }
    }

    if (newWidth !== currentWidth) {
      model.viewportWidth(newWidth);
    }
  };

  private onSizeClick = event => {
    const value = parseInt(event.currentTarget.getAttribute('data-size'), 10);
    model.viewportWidth(value);
  };

  private onMouseDown = event => {
    this.offsetX = event.offsetX;
    this.isBefore = $(event.currentTarget).hasClass('before');

    $(window).on('mousemove', this.onMouseMove);
    $(window).on('mouseup', this.onMouseUp);

    model.isResizingViewport(true);
  };

  private onMouseMove = event => {
    this.updateView(event.pageX);
  };

  private onMouseUp = event => {
    $(window).off('mousemove', this.onMouseMove);
    $(window).off('mouseup', this.onMouseUp);

    model.isResizingViewport(false);
  };

  private updateView(pageX) {
    const centerX = window.innerWidth / 2;
    let sideOffset;
    let halfWidth;
    if (this.isBefore) {
      sideOffset = pageX + (RESIZER_WIDTH - this.offsetX);
      halfWidth = centerX - sideOffset;
    } else {
      sideOffset = pageX - this.offsetX;
      halfWidth = sideOffset - centerX;
    }

    model.viewportWidth(halfWidth * 2);
  }

  public dispose() {
    $('.resizer', this.element).off('mousedown');
    $('.settings .generic', this.element).off('click');
    $('.settings .bar', this.element).off('click', this.onMediaBarClick);

    super.dispose();
  }
}
