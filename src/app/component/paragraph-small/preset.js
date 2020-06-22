/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('paragraph-small', require('./paragraph-small.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> paragraph-small @root}}
		</hbs>`,
  {},
);
