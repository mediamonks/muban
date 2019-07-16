1. [Introduction](./01-introduction.md)
   1. [Background](./01-introduction.md#Background)
   2. [Challenges](./01-introduction.md#Challenges)
   3. [What we came up with](./01-introduction.md#What-we-came-up-with)
      1. [Webpack](./01-introduction.md#Webpack)
      2. [Template](./01-introduction.md#Template)
      3. [Application](./01-introduction.md#Application)
      4. [Building](./01-introduction.md#Building)
      5. [Preview components](./01-introduction.md#Preview-components)
      6. [Integration](./01-introduction.md#Integration)
   4. [Closing words](./01-introduction.md#Closing-words)
2. [Setup guide](./02-setup-guide.md)
   1. [Preparations](./02-setup-guide.md#Preparations)
      1. [Compatibility note](./02-setup-guide.md#Compatibility-note)
      2. [Release notes](./02-setup-guide.md#Release-notes)
      3. [Get familiar with the technologies](./02-setup-guide.md#Get-familiar-witht-the-technologies)
         1. [Handlebars](./02-setup-guide.md#Handlebars)
         2. [SCSS](./02-setup-guide.md#SCSS)
         3. [TypeScript](./02-setup-guide.md#SCSS)
         4. [Knockout](./02-setup-guide.md#Knockout)
      4. [Setup your environment](./02-setup-guide.md#Setup-your-environment)
         1. [Install Node.js](./02-setup-guide.md#Install-Node.js) 
         2. [Install Yarn](./02-setup-guide.md#Install-Yarn)
         3. [Install the seng-generator CLI](./02-setup-guide.md#Install-the-seng-generator-CLI)
   2. [Getting started](./02-setup-guide.md)
      1. [Setup the project](./02-setup-guide.md#Setup-the-project)
         1. [Download source code](./02-setup-guide.md#Download-source-code)
         2. [Install dependencies](.02-setup-guide.md#Install-depenedencies)
         3. [Running the development server](.02-setup-guide.md#Running-the-development-server)
         4. [Running the Storybook server](./02-setup-guide.md#Running-the-Storybook-server)
         5. [Clean default setup](./02-setup-guide.md#Clean-default-setup)
            1. [Clean the boilerplate code](./02-setup-guide.md#Clean-the-boilerplate-code)
            2. [Clean Storybook](./02-setup-guide.md#Clean-Storybook)
      2. [Create a distribution build](./02-setup-guide.md#Create-a-distribution-build)
         1. [Preview the distribution build](./02-setup-guide.md#Preview-the-distribution-build)
      3. [Code quaility](./02-setup-guide.md#Code-quality)
         1. [EditorConfig](./02-setup-guide.md#EditorConfig)
         2. [Prettier](./02-setup-guide.md#Prettier)
         3. [Linting](./02-setup-guide.md#Linting)
            1. [esLint](./02-setup-guide.md#esLint)
            2. [tsLint](./02-setup-guide.md#tsLint)
            3. [StyleLint](./02-setup-guide.md#StyleLint)
         4. [Pre-commit hook](./02-setup-guide.md#Pre-commit-hook)
3. [Component](./03-component.md)
   1. [Types](./03-component.md#Types)
      1. [Component](./03-component.md#Component)
         1. [Handlebars](./03-component.md#Handlebars-[Component])
         2. [SCSS](./03-component.md#SCSS-[Component])
         3. [Preset](./03-component.md#Preset-[Component])
      2. [Smart-component](./03-component.md#Smart-component)
         1. [Handlebars](./03-component.md#Smart-component-[Smart-component])
         2. [SCSS](./03-component.md#SCSS-[Smart-component])
         3. [TypeScript](./03-component.md#TypeScript-[Smart-component])
         4. [Preset](./03-component.md#Preset-[Smart-component])
      3. [Block](./03-component.md#Block)
         1. [Handlebars](./03-component.md#Handlebars-[Block])
         2. [SCSS](./03-component.md#SCSS-[Block])
         3. [TypeScript](./03-component.md#TypeScript-[Block])
         4. [Data](./03-component.md#Data-[Block])
            1. [Local data](./03-component.md#Local-data-[Block])
            2. [Referenced data](./03-component.md#Imported-data-[Block])
         5. [Preset](./03-component.md#Preset-[Block])
   4. [Creating a component](./03-component.md#Creating-a-component)
      1. [Using the wizard](./03-component.md#Using-the-wizard)
      2. [Using the shorthand](./03-component.md#Using-the-shorthand)
4. [Page](./04-page.md)
   1. [Title](./04-page.md#Title)
   2. [Meta](./04-page.md#Meta)
   3. [Blocks](./04-page.md#Blocks)
      1. [Name](./04-page.md#Name)
      2. [Data](./04-page.md#Data)
         1. [Local data](./04-page.md#Local-data)
         2. [Imported data](./04-page.md#Imported-data)
   4. [Creating a page](./04-page.md#Creating-a-page)
      1. [Using the wizard](./04-page.md#Using-the-wizard)
      2. [Using the shorthand](./04-page.md#Using-the-shorthand)
5. [Application](./05-application.md)
	1. [Bootstrapping](./05-application.md#Bootstrapping)
		2. [Development bootstrapping](./05-application.md#Development-bootstrapping)
		3. [Production bootstrapping](./05-application.md#Production-bootstrapping)
   2. [Application Lifecycle](./05-application.md#Application-Lifecycle)
6. [Dynamic data](./06-dynamic-data.md)
   1. [Data provider](./06-dynamic-data.md#Data-provider)
   2. [Data templates](./06-dynamic-data.md#Data-templates)
7. [Handlebars](./07-handlebars.md)
   1. Helpers
8. [Knockout](./08-knockout.md)
   1. [API Reference](./08-knockout.md#API-reference)
      1. [applyBindingsToNode](./08-knockout.md#applyBindingsToNode)
      2. [applyBindingAccessorsToNode](./08-knockout.md#applyBindingAccessorsToNode)
9. [API Reference](./09-api-reference.md)
   1. [Muban](./09-api-reference.md#Muban)
      1. [initComponents](./09-api-reference.md#initComponents)
      2. [cleanElement](./09-api-reference.md#cleanElement)
      3. [updateElement](./09-api-reference.md#updateElement)
      4. [getComponentForElement](./09-api-reference.md#getComponentForElement)
   2. [Handlebars](./09-api-reference.md#Handlebars)
      1. [renderItem](./09-api-reference.md#renderItem)
      2. [renderItems](./09-api-reference.md#renderItems)
   3. [Knockout](./09-api-reference.md#Knockout)
      1. [initTextBinding](./09-api-reference.md#initTextBinding)
      2. [initListBinding](./09-api-reference.md#initListBinding)
   4. [Bootstrap](./09-api-reference.md#Bootstrap)
      1. [Development](./09-api-reference.md#Development)
      2. [Distribution](./09-api-reference.md#Distribution)
10. [Storybook](./09-storybook.md)
11. [Transitions and animations](./10-transitions-and-animations.md)
12. [Guides](./10-guides.md)
    1. Muban
       1. Create a component.
       2. Create a smart-component.
       3. Create a component block.
       4. Create a page.
       5. Do not use the default index template.
       6. Using JSON for data files.
       7. Using JavaScript for data files.
       8. Using JSON for page files
       9. Use custom variables in your data
       10. Add scripts/meta data to the head of your page.
    2. TypeScript
       1. Ensure all components have been initalised.
       2. Select child element/elements.
       3. Adding event listeners to components.
       4. Get data from data-attributes.
       5. Get data from embedded json.
       6. Get data from through a http-request.
       7. Update an entire section through a http-request.
           1. The API returns HTML.
           2. The API returns Json. 
       8. Sort or filter items already in the DOM.
       9. Load more itmes to the page.
           1. Use an existing DOM element.
           2. Use a handlebars template
           3. Use a knockout template
    3. Handlebars
       1. Render data in your component
       2. Render data as HTML in your component
       3. Render a component
       4. Reference static assets
       5. Dynamically render components
       6. Dynamically render out components that are not in the general folder.
       7. Create a custom helper
    4. Knockout 
       1. Create a global state
       2. Apply bindings to the entire component
    5. Webstorm
       1. Prettier shortcut       
    6. Seng-generator
       1. Create a custom template