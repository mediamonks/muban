/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('phases', require('./phases.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/phases @root}}
		</hbs>`,
  require('./data'),
);
