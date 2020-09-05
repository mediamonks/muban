/* eslint-disable no-template-curly-in-string,global-require */

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map(path => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'Icon',
  component: require('./icon'),
  argTypes: {
    name: {
      control: { type: 'select', options: svgNames },
      description:
        'Specifies what svg icon to render, provide a filename from the `/app/svg/icon/*.svg` folder.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Renders the svgs from the `/app/svg/icon/*.svg` folder as a component in the HTML, by providing the `name` property.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> icon @root }}
    </hbs>`,
});
Default.args = { name: 'arrow-up' };

export const All = () => ({
  template: `<hbs>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>icon</th>
          </tr>
        </thead>
        <tbody>
          {{#each names}}
          <tr>
            <td><pre>{{this}}</pre></td>
            <td>{{> icon name=this }}</td>
          </tr>
          {{/each}}
        </tbody>
  </hbs>`,
  data: { names: svgNames },
});
All.parameters = {
  docs: {
    iframeHeight: 300,
  },
};
