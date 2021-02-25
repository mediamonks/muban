/* eslint-disable no-template-curly-in-string,global-require, import/no-extraneous-dependencies, @typescript-eslint/naming-convention */

import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

export default {
  title: 'Paragraph',
  component: require('./paragraph'),
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    ctaReadMore: { control: 'text' },
    contentMore: { control: 'text' },
    // actions that will be logged
    expand: { action: 'expanded', table: { subcategory: 'events' } },
    collapse: { action: 'collapsed', table: { subcategory: 'events' } },
  },
  parameters: {
    source: {
      data: require('./data/data.yaml'),
    },
    docs: {
      description: {
        component: 'Just a boring paragraph example component that can expand and collapse',
      },
    },
  },
} as Meta;

export const Default = () => ({
  template: `<hbs>
      {{> paragraph @root }}
    </hbs>`,
});
Default.args = require('./data/data.yaml');

export const Simple = Default.bind({});
Simple.args = require('./data/data-simple');

export const CustomData = (args: { title: string }) => ({
  template: `<hbs>
      {{> paragraph @root }}
    </hbs>`,
  data: {
    title: args.title,
    content: args.title,
    ctaReadMore: args.title,
    contentMore: args.title,
  },
});
CustomData.args = { title: 'test' };
