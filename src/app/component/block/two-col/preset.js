/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('Two Col', require('./two-col'))
  .add(
    'default',
    'A block that has two columns of text, each with its own title.',
    `<hbs>
      {{> two-col @root }}
    </hbs>`,
    require('./data/data'),
  )
  .add(
    'small',
    'A smaller wrapper around the two colomns.',
    `<hbs>
      <div style="max-width: 600px">
        {{> two-col @root }}
      </div>
    </hbs>`,
    require('./data/data'),
  );
