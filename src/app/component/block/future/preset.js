/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('future', require('./future.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/future @root}}
		</hbs>`,
  require('./data'),
);
