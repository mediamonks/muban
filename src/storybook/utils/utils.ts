export function configure(loadStories: () => void) {
  loadStories();
}

export function storiesOf(name: string, component: any) {
  return {
    add(label: string = 'default', description: string = '', template: string, props: any = {}) {
      return this;
    },
  };
}
