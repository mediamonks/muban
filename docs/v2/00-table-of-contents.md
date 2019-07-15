1. Introduction
   1. Background
   2. Challenges
   3. What we came up with
      1. Webpack
      2. Template
      3. Application
      4. Building
      5. Preview components
      6. Integration
   4. Closing words
2. Setup guide
   1. Preparations
      1. Compatibility note
      2. Release notes
      3. Get familiar with the technologies
         1. Handlebars
         2. SCSS
         3. TypeScript
         4. Knockout
      4. Setup your environment
         1. Install Node.js 
         2. Install Yarn
         3. Install the seng-generator CLI
   2. Getting started
      1. Setup the project
         1. Download source code
         2. Install dependencies
         3. Running the development server
         4. Running the Storybook server
         5. Clean default setup
            1. Clean the boilerplate code
            2. Clean storybook
      2. Create a distribution build
         1. Preview the distribution build
      3. Code quaility
         1. EditorConfig
         2. Prettier
         3. Linting
            1. esLint
            2. tsLint
            3. StyleLint
         4. Pre-commit hook
3. Component
   1. Types
      1. Component
         1. Handlebars
         2. SCSS
         3. Preset
      2. Smart-component
         1. Handlebars
         2. SCSS
         3. TypeScript
         4. Preset
      3. Block
         1. Handlebars
         2. SCSS
         3. TypeScript
         4. Data
            1. Local data
            2. Referenced data
         5. Preset
   2. Data-attributes
   3. Element selecting
   4. Creating a component
      1. Manual
      2. Command-line-interface
4. Page
   1. Meta data
   2. Blocks
      1. Name
      2. Data
         1. Local data
         2. Referenced data
   3. Creating a page
      1. Manual
      2. Command-line-interface
5. Application
   1. Bootstrapping
   2. Lifecycles
6. Dynamic data
   1. Data provider
      1. data-attributes
      2. Embedded json
      3. Http-requests
   2. Data consumer
7. Handlebars
8. Knockout
   1. API Reference
      1. applyBindingsToNode
      2. applyBindingAccessorsToNode
9. API Reference
   1. Muban
      1. initComponents
      2. cleanElement
      3. updateElement
      4. getComponentForElement
   2. Handlebars
      1. renderItem
      2. renderItems
   3. Knockout
      1. initTextBinding
      2. initListBinding
   4. Bootstrap
      1. Dist
      2. Dev
10. Storybook
11. Transitions & Animations
    1. muban-transition-component
12. Tutorials
    1. Muban
       1. Create your first block
       2. Create your first component
       3. Create your first page
       4. Do not use the default index template.
    2. Handlebars
       1. Render data in your component
       2. Render data as HTML in your component
       3. Render a component
       4. Reference assets
       5. Dynamically render components
       6. Create a custom helper
    3. Knockout 
       1. Create a global state
       2. Apply bindings to the entire component