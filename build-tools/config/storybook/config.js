import { configure } from 'storybook/utils/utils';

const context = require.context('app/component/', true, /preset\.js$/);

function loadStories() {
  context.keys().forEach(context);
}

configure(loadStories);
