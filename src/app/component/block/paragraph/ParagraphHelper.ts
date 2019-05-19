import { Lib } from 'Lib';

class ParagraphHelper {
  constructor(private readonly msg: string) {
    this.msg = msg;
  }

  help(): void {
    // tslint:disable-next-line no-console
    console.log(this.msg, 'help given!');
  }
}

export default ParagraphHelper;

// make this class available to others at runtime
Lib.addShared({ ParagraphHelper });
