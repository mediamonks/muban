/* eslint-disable no-template-curly-in-string,global-require */
const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map(path => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'Button',
  component: require('./button'),
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'The button label',
      type: { summary: 'string' },
      defaultValue: { summary: 'click me!' },
    },
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies what icon to render in the button',
      type: { summary: 'string' },
      defaultValue: { summary: 'arrow-up' },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a button with an icon',
      },
    },
  },
};

export const Default = () => ({});
Default.args = {
  text: 'click me',
  icon: 'arrow-up',
};
