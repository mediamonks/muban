/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('perks', require('./perks.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/perks @root}}
		</hbs>`,
  require('./data'),
);
