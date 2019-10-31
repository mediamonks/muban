/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('Paragraph', require('./paragraph'))
  .add(
    'default',
    'A Paragraph block with a "read more" section you can show by clicking a button.',
    `<hbs>
      {{> paragraph @root }}
    </hbs>`,
    require('./data/data'),
  )
  .add(
    'no more content',
    'Without more content, hides the button',
    `<hbs>
      <div style="max-width: 400px;">
        {{> paragraph @root }}
      </div>
    </hbs>`,
    require('./data/data-simple'),
  );
