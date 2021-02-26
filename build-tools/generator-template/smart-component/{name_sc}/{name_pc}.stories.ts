/* eslint-disable no-template-curly-in-string,global-require, import/no-extraneous-dependencies, @typescript-eslint/naming-convention */

import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

export default {
  title: '{{name_pc}}',
  component: require('./{{name_sc}}'),
  argTypes: {
    // title: { control: 'text' },
  },
  parameters: {
    source: {
      data: require('./data/default.yaml'),
    },
    docs: {
      description: {
        component: 'Component Description',
      },
    },
  },
} as Meta;

export const Default = () => ({});
Default.args = require('./data/default.yaml');

// export const Variation = Default.bind({});
// Variation.args = require('./data/variation.yaml');
