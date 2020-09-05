/* eslint-disable no-template-curly-in-string,global-require */
import flatten, { unflatten } from 'flat';

export default {
  title: 'TwoCol',
  component: require('./two-col'),
  argTypes: {
    'left.title': { control: 'text' },
    'left.content': { control: 'text' },
    'right.title': { control: 'text' },
    'right.content': { control: 'text' },
  },
  parameters: {
    source: {
      data: require('./data/data'),
    },
    docs: {
      description: {
        component: 'Just 2 columns',
      },
    },
  },
};

export const Default = args => ({
  template: `<hbs>
      {{> two-col @root }}
    </hbs>`,
  data: unflatten(args),
});
Default.args = flatten(require('./data/data.yaml'));

export const OnlyLeft = Default.bind({});
OnlyLeft.args = flatten({
  left: {
    title: 'title',
    content: 'Content ...',
  },
});

export const OnlyRight = Default.bind({});
OnlyRight.args = flatten({
  right: {
    title: 'title',
    content: 'Content ...',
  },
});
