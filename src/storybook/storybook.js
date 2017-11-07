/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
import qs from 'qs';

import 'app/style/main.scss';
import { initComponents } from 'app/muban/componentUtils';
import { getAllStories, getStory } from './utils/utils';
import { getStoryInfo } from './utils/getStoryInfo';

import storybookTemplate from './component/storybook/storybook';

function render() {
  const div = document.getElementById('app');
  const params = qs.parse(document.location.search, { ignoreQueryPrefix: true });

  let data = {
    story: params.storyName,
    variant: params.variant,
  };

  const stories = getAllStories();

  data.storyList = Object.keys(stories).map(story => ({
    label: story,
    path: stories[story][0].path,
    variants: stories[story].map((variant, index) => ({
      ...variant,
      story,
      variant: index,
    })),
  }));

  const story = getStory(params.storyName, params.variant);

  if (story) {
    const storyData = getStoryInfo(story, params.variant);

    data = {
      ...data,
      ...storyData,
    };
  }

  div.innerHTML = storybookTemplate(data);

  initComponents(div);
}

document.addEventListener('DOMContentLoaded', () => {
  render();
});

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept(['./component/storybook/storybook.hbs'], () => {
    render();
  });
}
