/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('hero', require('./hero.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/hero @root}}
		</hbs>`,
  require('./data'),
);
