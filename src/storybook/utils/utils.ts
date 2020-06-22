declare var require: any;

const stories = {};

export function configure(loadStories) {
  loadStories();
}

export function storiesOf(name, component) {
  stories[name] = [];

  return {
    add(label = 'default', description = '', template, props = {}) {
      stories[name].push({
        name,
        label,
        description,
        template,
        props,
        path: component.path,
        source: component,
        component: component.default,
        variant: stories[name].length,
      });

      return this;
    },
  };
}

export function getAllStories() {
  return stories;
}

export function getStories(name, variant) {
  if (!name) {
    return Object.keys(stories).reduce((list, storyName) => list.concat(stories[storyName]), []);
  }
  if (!variant) {
    return stories[name];
  }
  return [stories[name][variant]];
}

export function getStory(name, variant) {
  return stories[name] && stories[name][variant];
}
