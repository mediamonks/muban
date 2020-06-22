/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('vision', require('./vision.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/vision @root}}
		</hbs>`,
  require('./data'),
);
