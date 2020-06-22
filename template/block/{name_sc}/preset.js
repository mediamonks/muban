/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('{{name_sc}}', require('./{{name_sc}}.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			\{{> block/{{name_sc}} @root}}
		</hbs>`,
  require('./data'),
);
