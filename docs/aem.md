# AEM

The version in this branch is specifically built for AEM clientlib projects, where each component is
exported separately with its own js and css file.

The shared bundle with all the common code is build into its own bundle, and resources are placed
into its own folder.

The output mimics a normal AEM project;
```
<project-name>
  clientlibs
    clientlibs-ui
    clientlibs-site
      resources
        demo.jpg
    clientlibs-shared
      button
        clientlib
          js
            Button.js
          css
            button.css
          js.txt
          css.txt
      bundle
        clientlib
          js
            bundle.js
          css
            bundle.css
          js.txt
          css.txt
  components
    content
      paragraph
        v1
          clientlib
            js
              Paragraph.js
              ParagraphHelper.js
            css
              paragraph.css
            js.txt
            css.txt
```

## Differences

This version of the Muban project is different in the following ways:

### Webpack / babel

Webpack is only used to create the common bundle. All other component files are processed using
babel and scss/postcss directly. This means that components cannot directly import other files or
node modules.

All shared code must be present on the window and loaded earlier than the script needing it. To
provide this option, Muban introduces the `Lib` file, that is used to re-export any common file
or node_module. This `Lib` object is placed on the window, and component files can make usee of it.

Common files and node modules are not the only files to be shared or imported. Components themselves
can also have files they need to import, but only in the scope of that component. For this the `Lib`
object provides `share` and `get/create` functions to share classes at runtime only when they are
used.

#### imports & exports

In component files, babel will strip ALL imports and exports.

**Imports**

There are two types of imports that are allowed in component files:

1) Imports to Lib; `import { Lib } from 'Lib';`;
2) Imports that are used for TS typings only:
  ```ts
  import Icon from '../../general/icon/Icon';
  
  Lib.MubanCore.getComponentForElement<Icon>(this.btnIcon).setIcon('arrow-down');
  ```

**Exports**

All exports are stripped, so make sure your exports are placed separately:
```ts
class Foo {}
export default Foo;
```

If you were to write `export default class Foo {}` the whole class would be stripped.

### Assets

Within the shared files webpack can be used to import and bundle assets. Component files cannot.
They have to load all their files from network requests through the `etc.clientlibs` proxy.

This means that any file from css should be referenced using this variable from `_variables.scss`:
```scss
$assetRoot: '/etc.clientlibs/project-name/clientlibs/clientlibs-site/resources/';
```

These files should be placed into the `src/asset` folder. During dev the webpack-dev-server will
make those files available through the proper URL, and during a build these files are copied over
the the right locations; one in the correct AEM structure, and a duplicate on the proxy location
to make static preview builds work.

**Note:** This css variable needs to be in sync with `proxyAssetPath` in
`build-tools/config/config.js`.
```js
const proxyAssetPath = 'etc.clientlibs/project-name/clientlibs/clientlibs-site/resources/';
```

### Components

A typical component would have the following structure:

```ts
// Always import this
import { Lib } from 'Lib';

// import types only, all imports will be removed on build
import AbstractBlock from '../AbstractBlock';
import ParagraphHelper from './ParagraphHelper';

class Paragraph extends Lib.Muban.AbstractBlock {
  static displayName: string = 'paragraph';

  // importing AbstractBlock for typing is fine here
  private ab2:AbstractBlock = new Lib.Muban.AbstractBlock(
    document.getElementById('foo')!);

  constructor(el: HTMLElement) {
    super(el);

    // example of getting a class and constructing it with proper typescript
    const helper1 = new (Lib.getShared<typeof ParagraphHelper>('ParagraphHelper'))('msg');
    helper1.help();

    // example of getting a new instance of a class with the correct constructor arguments
    const helper2 = Lib.createShared<typeof ParagraphHelper>('ParagraphHelper', 'msg');
    helper2.help();
  }
}

// Register the component to muban
Lib.MubanCore.registerComponent(Paragraph);
```

If we have another component (`ParagraphHelper` in this example), it would look like this:
```ts
// Always import this
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

// This should be on its onw line
export default ParagraphHelper;

// make this class available to others at runtime
Lib.addShared({ ParagraphHelper });
```

#### Exceptions

Some components require webpack to nicely include assets. This can be done, but it means they will
be included in the main bundle instead as separate component. This will be fine, but only for
general small atoms that are used across all components. Besides those, the `layout/app` is also
included in the main bundle by default.

To include a component in the main bundle instead of a standalone version, add its glob to the
`componentGlobIgnore` array in `build-tools/config/config.js`:
```
componentGlobIgnore: ['**/Abstract*', '**/layout/**/*', '**/_*', '**/icon/**/*']
```

Anything not specified in that array that is present in the `app/component` folder will end up as an
individual component in the build output.

### Lib.ts

This file is responsible for sharing code between all files especially the components. The top
section contains all the statically shared code:
```ts
import AbstractBlock from './app/component/block/AbstractBlock';
import AbstractComponent from './app/component/AbstractComponent';
import { getComponentForElement, registerComponent } from 'muban-core';

// Share all shared code and node_modules on this window namespace
const StaticLib = {
  // muban related shared code
  Muban: {
    AbstractComponent,
    AbstractBlock,
  },
  // muban-core utils
  MubanCore: {
    getComponentForElement,
    registerComponent,
  },
  // any node modules you are using in the code
  Modules: {},
};
```

In the Modules area you can re-export any node_modules you like to use.

#### Runtime

The bottom section of `Lib.ts` contains 3 util functions to dynamically share any code:

**addShared**

Makes a class available to others, but only when it's loaded.

```ts
function addShared(classes: { [key: string]: Constructor<any> }): void;

// usage
class ParagraphHelper {
  constructor(private readonly msg: string) {}
}
Lib.addShared({ ParagraphHelper });
```

**getShared**

Gets the shared class, so it can be used to make a new instance.

```ts
function getShared<T extends Constructor<InstanceType<T>>>(name: string): T;

// usage
const helper = new (Lib.getShared<typeof ParagraphHelper>('ParagraphHelper'))('msg');
helper.help();
```

**createShared**

Factory function to create a new instance, has a bit nicer syntax.

```ts
function createShared<T extends new (...args: any) => any>(
    name: string,
    ...args: ConstructorArgs<T>
  ): InstanceType<T>;

// usage
const helper = Lib.createShared<typeof ParagraphHelper>('ParagraphHelper', 'msg');
helper.help();
```
