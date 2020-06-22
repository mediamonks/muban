/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('storybook', require('./storybook.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/storybook @root}}
		</hbs>`,
  require('./data'),
);
