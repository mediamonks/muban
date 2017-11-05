/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('Button', require('./button.hbs'))
  .add(
    'with Foo',
    'Just a normal button that says Foo.',
    `<hbs>
			{{> button text=text}}
		</hbs>`,
    { text: 'foo' },
  )
  .add(
    'with Click',
    'A special button that you can click!',
    `<hbs>
			<div>
				{{> button text=text }}
			</div>
		</hbs>`,
    { text: 'Click Me!' },
  );
