# Component

A component is a potentially re-usable set of logic, behaviours and interface elements that speeds
up the creation of an application. If you work on a Muban project its good too keep in mind that
everything is a component.

> ⚠️ [See the guide](./13-guides.md#Create-a-component) on how to create your own component!

## Types

Muban basically has three types of components that extend each other.

```
+----------------------+ 
|                      | 
|      Component       | 
|                      | 
+----------+-----------+ 
           |             
+----------v-----------+ 
|                      | 
|    Smart-component   | 
|                      | 
+----------+-----------+ 
           |             
+----------v-----------+ 
|                      | 
|        Block         | 
|                      | 
+----------------------+ 
```

### Component

The most basic form of a component within Muban would be the regular component. The regular
component is used for basically all user interface elements that do not require any logic or
functionality.

The basic component has the following structure.

```
my-component/
  - my-component.hbs
  - my-component.scss
  - preset.js
```

#### Handlebars [Component]

The `.hbs` file is the core of any component within Muban. It contains the HTML that is required for
component

The most basic example of a Muban component could be a file called `button.hbs`

```handlebars
<div class="my-component">Hi 👋</div>
```

#### SCSS [Component]

Since you will probably never render out HTML without styling there is also a `.scss` file
available. This file contains all the styling for your component. To make sure it's loaded you will
have to add it to the `.hbs` file. This way webpack will make sure it is bundled in your main css
file.

```handlebars
<link rel="stylesheet" href="./my-component.scss">

<div class="my-component">Hi! 👋</div>
```

Since we are now trying to load a file called `my-button.scss` we will have to add it to the same
folder.

```scss
.my-component {
  color: red;
}
```

> **Note:** The `.scss` file is technically optional so if you don't need it you could remove it.

#### Preset [Component]

_Note: If you have removed storybook from your Muban project you can skip this part._

The final file for any component is the `preset.js` file, this file contains the information
required by Storybook to render out the stories. To read more about storybook and the preset files
please see the page on Storybook.

### Smart-component

A smart-component is the next step in components, it has the same base as the basic component except
it also has a TypeScript file that contains logic.

The smart-component has the following structure.

```
my-smart-component/
  - my-smart-component.hbs
  - my-smart-component.scss
  - MySmartComponent.ts
  - preset.js
```

#### Handlebars [Smart-component]

In the handlebars the only difference is that the root element of your component will have an extra
data attribute that is used to initialise the component.

```handlebars
<div class="my-smart-component" data-component="my-smart-component">I'm smart! 🤓</div>
```

#### SCSS [Smart-component]

The `.scss` file for the smart-component is exactly the same as the one for the basic component.

#### Preset [Smart-component]

The `preset.js` file for the smart-component is exactly the same as the one for the basic component.

#### TypeScript [Smart-component]

The smart part of the smart-component is the TypeScript file. This file adds all the logic to your
component. To enable it simply load it in your `.hbs` the same way you did as for the `.scss` file.

```handlebars
<link rel="stylesheet" href="./my-smart-component.scss">
<script src="./MySmartComponent.ts"></script>

<div class="my-smart-component" data-component="my-smart-component">I'm smart! 🤓</div>
```

Since we are now trying to load a file called `MyButton.ts` we will have to add it to the same
folder.

```typescript
import AbstractComponent from '../AbstractComponent';

export default class MySmartComponent extends AbstractComponent {
  static displayName: string = 'my-smart-component';

  constructor(el: HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}
```

Here you can see that we create a class that extends the `AbstractComponent`, this makes sure that
we have all the base logic that is required for Muban to initialise the components and provide the
default functionality. 

It's important that the static `displayName` value matches the `data-component` attribute value 
in the handlebars file because Muban uses these values to bind them together. 

> **Note:** If you don't want to use TypeScript you could also create a JavaScript file, just keep in
mind that your will lose all typings.

### Block

The final step in components would be a block, a block is the largest type of component in Muban.
Blocks are the building stones on which the pages within Muban are build. They are loaded on the
pages and will have data provided to them.

A block has the following structure.

```
my-block/
  - my-block.hbs
  - my-block.scss
  - MyBlock.ts
  - data.yaml
  - preset.js
```

#### Handlebars [Block]

The `.hbs` file for a block is exactly the same as the one for a smart-component.

#### SCSS [Block]

The `.scss` file for a block is exactly the same as the one for a smart-component.

#### Preset [Block]

The `preset.js` file for a block is exactly the same as the one for the smart-component.

#### Data [Block]

One of the main things that separates a block from a smart-component is the data that is attached to
it. The data files provide the content and structure of your block, they represent the eventual
backend data that will be used to render the templates on the server.

Data files can be one of the following formats and can be used interchangeably.

1. Yaml
2. [Json](./13-guides.md#Using-JSON-for-data-files)
3. [JavaScript](./13-guides.md#Using-JavaScript-for-data-files)

Since `yaml` is less verbose, and can better handle multiline content, we've chosen that as the
default. If you want to use any of the other formats please see the Tutorial section.

You could create as many data files as you want for each specific situation, for now just add a
single `data.yaml` file for your block.

Inside of your data file we can add the content that will be rendered in the block. There are two
ways of defining data.

1. Local data
2. Referenced data

> **Note:** Make sure to match your data structure with the backend to avoid major differences while
> implementing

##### Local data [Block]

The local data is the data dat is entered directly in your data file. It is the most simple way of
adding data but in the long run this could cause a lot of duplication.

```yaml
title: "Hi I'm a block! 💪"
content: "I'm the body copy for the block."
```

##### Imported data [Block]

This imported data is fetched from another file using the
[json-import-loader](https://www.npmjs.com/package/json-import-loader). You can import other files
by adding the following prefix to your path.

```javascript
import!path-to-file
```

Data could come from any other folder within your project, so if you would like to add
`otherContent` to your data file it would look like this.

```yaml
title: "Hi I'm a block! 💪"
content: "I'm the body copy for the block."
otherContent: 'import!./some-other-content.yaml'
```

> **Note:** Keep in mind that import paths are relative!
