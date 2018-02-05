/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('icon', require('./icon.hbs')).add(
  'default',
  'This component is used to render out svg icons.',
  `<hbs>
			{{> icon @root name=name}}
		</hbs>`,
  {
    name: 'svg-name',
  },
);
