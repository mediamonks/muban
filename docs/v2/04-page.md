# Page

As described in the page on components Muban exists of three types of components. The blocks are the biggest components and they are used to build up the pages. A page in Muban is *a single file* that contains the structure and the data for that page. 

A page can be in one of the following formats:

1. Yaml
2. Json

Since `yaml` is less verbose, and can better handle multiline content, we've chosen that as the default. If you want to use any of the other formats please see the Tutorial section.

A page file is build up in three different sections.

1. Title
2. Meta
3. Blocks

### Title

The title is the most basic part and describes the page title.  It is used for the following values:

- The `<title>` tag in the `<head>`.
- The name of the HTML page
- The path in the generated  `index.html` overview.

```yaml
title: 'Home'
```

### Meta

The meta section contains the information that is used on the generated `index.html` overview page.

```yaml
meta:
  id: '01-home' # can be number or string, used for ordering
  status: 'dev' # dev, qa, feedback, done
  notes: 'Look at this awesome page.' # add some information about the page
  category: 'pages' # to group pages in the overview
```

*Note: These values are not used in a production build and are only there for development purpose.*

### Blocks

The blocks section is the list of blocks that should be rendered to display the page. 

A block exists of two values. 

1. `name`
2. `data`

#### Name

The name is the name of the block component that should be rendered. 

*Note: Keep in mind that the casing should be in `slug-case`*

```yaml
blocks:
  - name: 'my-block'
    data: "import!../app/component/block/my-block/data.yaml"
  - name: 'my-other-block'
    data: "import!../app/component/block/my-other-block/data.yaml"    
```

#### Data

The data provides the content and structure of your block, it represents the eventual backend data that will be used to render the templates on the server. Usually all blocks contain data and it is defined on the page that the block is rendered. 

There can be two ways of providing data to your block.

##### Local data

Local data is data that is directly defined in the data key of your block. You will probably not use this but if your block uses specific data that is only required on that page you could define it on page level.

```yaml
blocks:
  - name: 'my-block'
    data: 
      title: "Hi I'm a the same block but with different content! 💪"
      content: "I'm the specific body copy for the block."
```

*Note: keep in mind that if you choose to use local data you will have to write all data for that block locally.*

##### Imported data

Imported data is data that is imported from another location. If you look at the block section on the page about components you can see that all blocks all have a local `data.yaml` file. This file can be used to provide the same data to multiple instances of the same block without having to write it multiple times.

```yaml
blocks:
  - name: 'my-block'
    data: "import!../app/component/block/my-block/data.yaml"
```

## Creating a page

Now that we have covered all the parts that make up a page you could create them manually. This process takes up a lot of time and increases the chance of errors. To avoid this you can use the [seng-generator](https://www.npmjs.com/package/seng-generator) to generate them for you! If you followed the preparation instructions you will by now have this installed. 

### Using the wizard

Start by opening the terminal in the root of your project and run the following command.

```
sg wizard
```

This will start up the wizard and it will prompt you with a couple of questions. Use the provided instructions to select the template that you want to use. 

*Note: Leave the block, component and smart-component for what it is now, we will cover this in the section on components.*

```
? Which template do you want to use? (Use arrow keys)
  block
  component
> page
  smart-component
```

After that enter the desired name of your page.

*Note: The casing will automatically be changed to the required format.*

```
? Which template do you want to use? my-page
? What name do you want to use? () 
```

After you've provided the name you can choose the location where the page should be created. The default directory is shown so if you don't want to change this just press `enter`  to continue.

*Note: If you want to provide a different location please provide the full relative path from the root of your project.*

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? (./src/data) 
```

After that you can provide an optional list of blocks that you want to render out on that page. If you want to skip this step you can just press `enter`. Otherwise provide a `slug-cased` list of components that you want to render.

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? ./src/data
? Add a list of comma separated blocks (optional) () 
```

After you pressed enter it will notify you that the page has been successfully created.

```
? Which template do you want to use? page
? What name do you want to use? my-page
? Where do you want to create the page? ./src/data
? Add a list of comma separated blocks (optional) my-block
Generating files from 'page' template with name: my-page

Done!
```

### Using the shorthand

While using the wizard to generate your pages is very easy and descriptive of what's happening it requires quite a lot of interaction. If you do not want to go through this every time you can use the shorthand to create the pages.

Open up the terminal in the root of your project and run the following command:

```
sg page my-page
```

*Note: This will generate a page file for you, but leave out the step to render in blocks.*