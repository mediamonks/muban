import ko from 'knockout';

class Model {
  public deviceEmulateEnabled: KnockoutObservable<boolean> = ko.observable(false);
  public viewportWidth: KnockoutObservable<number> = ko.observable(1024);
  public isResizingViewport: KnockoutObservable<boolean> = ko.observable(false);
}

export default new Model();
