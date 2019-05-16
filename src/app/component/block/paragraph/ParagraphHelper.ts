import { Lib } from 'Lib';

class ParagraphHelper {
  constructor() {}

  help(): void {
    // tslint:disable-next-line no-console
    console.log('help given!');
  }
}

export default ParagraphHelper;

Lib.addShared({ ParagraphHelper });
