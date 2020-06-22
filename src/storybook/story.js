/**
 * This file is only used during development.
 * It's set up to render the hbs templates in the DOM using javascript, and supports hot reloading.
 */
import 'modernizr';
import qs from 'qs';

import 'app/style/main.scss';
import { initComponents, cleanElement } from 'app/muban/componentUtils';

import { getStories } from './utils/utils';
import { getStoryInfo } from './utils/getStoryInfo';

import storyListTemplate from './story-list';
import storySingleTemplate from './story-single';

function render(clean) {
  const div = document.getElementById('app');

  if (clean) {
    cleanElement(div);
  }

  const params = qs.parse(document.location.search, { ignoreQueryPrefix: true });

  let content = 'Please select a component!';
  const storiesInfo = getStories(params.storyName, params.variant);
  console.log(storiesInfo);

  const stories = storiesInfo.map(story => getStoryInfo(story));

  if (params.variant) {
    content = storySingleTemplate({ component: stories[0].rendered });
  } else {
    content = storyListTemplate({
      stories,
    });
  }

  div.innerHTML = content;

  initComponents(div);
}

document.addEventListener('DOMContentLoaded', () => {
  render();
});

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept(['./story-list', './story-single'], () => {
    render(true);
  });
}
