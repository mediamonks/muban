/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('{{name_sc}}', require('./{{name_sc}}.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			\{{> {{name_sc}} @root}}
		</hbs>`,
  {},
);
