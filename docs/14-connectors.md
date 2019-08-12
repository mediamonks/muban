# Connectors

While talking about connectors, we assume that the technology that a platform is built in is using a CMS or a Framework, such as Drupal, Wordpress or any other.

The list of connectors/modules is listed below:

Drupal Handlebars for Drupal 8 - https://github.com/mediamonks/drupal-handlebars.git


## Drupal 8
### Installation

In order to perform Muban integration with Drupal, first of all you will need to install Drupal Handlebars module.
In your project <b>composer.json</b> include the repository

```json
"repositories": [
  {
     "type": "git",
     "url": "https://github.com/mediamonks/drupal-handlebars.git"
  },
  ...
  ]
```

Then execute:

```sh
 composer require "drupal/handlebars_theme_handler:1.6"
```

If you use drush, you can enable the module in the following way:
```sh
 drush en handlebars_theme_handler -y
```

### Helper functions

Create a custom module, let's call it `mymodule_components`, define `.module` and `info.yml` files.
Inside your custom module create a src/Handlebars/Helpers folder where you will place following 2 files:

+ src/Handlebars/Helpers/ConditionHelper.php

```php
<?php

namespace Drupal\mymodule_components\Handlebars\Helpers;

use Handlebars\Context;
use Handlebars\Helper;
use Handlebars\Template;

/**
 * Handlebars condition helper.
 */
class ConditionHelper implements Helper {

  /**
   * {@inheritdoc}
   */
  public function execute(Template $template, Context $context, $args, $source) {
    $parsedArgs = $template->parseArguments($args);
    switch ($parsedArgs[1]) {
      case '===':
        if (!empty($context->get($parsedArgs[2]))) {
          $buffer = (string) $context->get($parsedArgs[0]) === (string) $context->get($parsedArgs[2]);
        }
        else {
          $buffer = (string) $context->get($parsedArgs[0]) === (string) $parsedArgs[2];
        }
        break;

      case '==':
        $buffer = $context->get($parsedArgs[0]) == (string) $parsedArgs[2];
        break;

      case '>=':
        $buffer = $context->get($parsedArgs[0]) >= (string) $parsedArgs[2];
        break;

      case '>':
        $buffer = $context->get($parsedArgs[0]) > (string) $parsedArgs[2];
        break;

      case '!==':
        $buffer = (string) $context->get($parsedArgs[0]) !== (string) $parsedArgs[2];
        break;

      case '||':
        $buffer = ($context->get($parsedArgs[0]) || $context->get($parsedArgs[2]) ? TRUE : FALSE);
        break;

      default:
        throw new \Exception("Unknown operation: $parsedArgs[1] for condition helper");
    }

    return $buffer;
  }

```
+ src/Handlebars/Helpers/IfInHelper.php

```php
<?php

namespace Drupal\mymodule_components\Handlebars\Helpers;

use Handlebars\Context;
use Handlebars\Helper;
use Handlebars\Template;

/**
 * Handlebars if-in helper.
 */
class IfInHelper implements Helper {

  /**
   * {@inheritdoc}
   */
  public function execute(Template $template, Context $context, $args, $source) {
    $parsedArgs = $template->parseArguments($args);
    $value = $context->get($parsedArgs[0]);
    $list = $context->get($parsedArgs[1]);

    if (is_array($list) && in_array($value, $list)) {
      $template->setStopToken('else');
      $buffer = $template->render($context);
      $template->setStopToken(FALSE);
      $template->discard($context);
    }
    else {
      $template->setStopToken('else');
      $template->discard($context);
      $template->setStopToken(FALSE);
      $buffer = $template->render($context);
    }

    return $buffer;
  }
}

```

Don't forget to update the namespaces in both files matching your module name.
These 2 classes are needed in order to let resolve handlebars conditional statements easier.

### Creating preprocessors
There are 3 initial steps while working with handlebars:

+ Step 1: Create entities in Drupal eg. Paragraphs, Menus, Nodes.
+ Step 2: Create preprocessor that matches data.yml structure of the component.
+ Step 3: Sync muban component to Drupal theme folder.
+ Step 4: Bridge handlebars through twig, through handlebars include function.
+ Step 5: Update the assets (css/js).

#### Step 1 - Creating entities
On step 1 we assume that you use [Paragraphs Drupal Module](https://www.drupal.org/project/paragraphs) in order to buid your components.
Let's assume that you already created a paragraph (paragraph machine name: c01_hero) that contains:

+ Title [field_title] [textfield]
+ Body  [field_body] [textarea]
+ Image [field_image] [image]

#### Step 2 - Creating preprocessor
Now having the paragraph created, we can create a preprocessor - this is needed to aggregate data and pass it to the theming layer - in our case this is handlebars.
As a result our preprocessor should return an array or a nested array that will be converted in variables inside of the hbs template.
Let's take a look at the data.yml file of the component that our front-end prepared:

+ data.yaml
```yaml
title: 'Title goes here'
body: 'some longer text description'
image:
  src: 'hero/image-small.jpg'
  alt: 'alt text'
```

As you can see this is the pattern that our preprocessor needs to return. The data.yaml file is used to mock variables and texts,
so once Muban is compiled and you access Muban preview, you exactly see this content.
The next step is to create a preprocessor that takes data from paragraph fields and returns it in same format as in the provided data.yaml file.

+ First of all we need to create the following folders inside of our custom module 'mymodule_components':
+ `src/Plugin/ThemeEntityProcessor/{EntityType}` - where `{EntityType}` can be a Paragraph, Node, Media etc... 

In our case it will be a preprocessor for paragraph `src/Plugin/ThemeEntityProcessor/ParagraphsBlock`.
Inside of this folder, we will create a PHP Class that will match the name of our c01_hero component.

+ src/Plugin/ThemeEntityProcessor/ParagraphC01Hero.php

and the contents of file will look like this: 
```php
<?php

namespace Drupal\c01_hero\Plugin\ThemeEntityProcessor\Paragraph;

use Drupal\handlebars_theme_handler\Plugin\ThemeEntityProcessorBase;

/**
 * Returns the structured data of an entity.
 *
 * @ThemeEntityProcessor(
 *   id = "c01_hero",
 *   label = @Translation("C01 Hero"),
 *   entity_type = "paragraph",
 *   bundle = "c01_hero",
 *   view_mode = "default"
 * )
 */
class ParagraphC17ContactInfoLinkItem extends ThemeEntityProcessorBase {

  /**
   * {@inheritdoc}
   */
  public function preprocessItemData(&$variables) {
    $image = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_image']);
    $title = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_title']);
    $body = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_body']);
    $variables['data'] = [
      'title' => $title,
      'body' => $body,
      'image' => [
        'src' => $image['image']['src'], 
        'alt' => $image['image']['alt']
        ]
    ];
  }
}

```

Now let's take a look at the annotation of the class, as you can see it contains:
+ `id` - this is an id of the preprocessor, usually we keep it as `{machineName}_{viewMode}`, it should be unique.
+ `label` - human readable label
+ `entity_type` - in our case it's `paragraph`
+ `bundle` - is machine name of the entity, in our case `c01_hero`
+ `view_mode` - the view mode for which we create a preprocessor, in our case is `default`. In the future you can create more view modes for entities and create a separate preprocessor per view mode.

The annotation is automatically decoded by `ThemeEntityProcessor` and used further.
Also you can note that the main class is matching the file name and it extends the `ThemeEntityProcessorBase`, this is a requirement.
In case you need more flexibility, you can create an intermediate class `MyModuleIntermediateBase extends ThemeEntitiyProcessorBase` so you can change something in the middle. Use the power of OOP and Dependency Injection to your advantage.

The final point is that your class should implement thee `preprocessItemData` function.

Now let's take a closer look at how to retrieve the filed data.

+ Because of the annotation, the preprocessor knows what type of paragraph it is.
+ `ThemeEntityProcessorBase` provides some key methods that allows the retrieval of the field data in a generic way, so you don't have to parse all nested arrays and objects for image fields, text fields, etc. It does all for you!
+ You simply call:

```php
$this->themeFieldProcessorManager->getFieldData($variables['elements']['field_title'])
```

Where `field_title` is substituted with a machine name of the field you want to retrieve.
The output will vary based on the field widget, let's check some examples:

+ Textfield

```php
$text = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_title'])

echo $text; // Output: 'Some text'

```

+ Imagefield
```php
$image = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_image'])

var_dump($image); // 
Output array: 
[ 
 ['image'] =>
     'src' => '/files/image.jpg'
     'alt' => 'some alt text'
]
```
+ Link field
```php
$link = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_link'])

var_dump($image); // 
Output array: 
[
 'url' => 'http://google.com'
 'label' => 'Click Here'
]
```

As the last step, we need to build a render array, meaning that inside of `$variables['data']` you need to mimic same structure as in data.yml,
with the exact same naming of array keys _(a.k.a. variables)_.

```php
 $variables['data'] = [
      'title' => $image,
      'body' => $body,
      'image' => [
        'src' => $image['image']['src'], 
        'alt' => $image['image']['alt']
        ]
    ];
```

This was the last step for creating a preprocessor.

Bonus content: 
Below we will show some extra tweaks that might be useful while working with the `getFieldData` method.


+ Retrieving multivalue field contents.
```php
$this->themeFieldProcessorManager->getFieldData($variables['elements']['field_reviews'], ['multiple' => TRUE])
```
As you might notice, the second argument for `getFieldData` are options. In uppercase we use `multiple => true` to tell that this is a multi-value field,
the result output does not change, the only thing is that it will return a key based array.

+ Returning image with image styles.

```php
$this->themeFieldProcessorManager->getFieldData($variables['elements']['field_image'], [
   'style' => [
      'mobile' => 'image_banner_small',
      'desktop' => 'image_banner',
    ],
  ]),
```

In order to retrieve an image in some predefined styles, a style key can be passed with machine names of image styles for conversion.

After you are done with the preprocessor, it is recommended to drop the drupal cache:

```sh
drush cr
```

You can create a demo page with the paragraph component on it and see the result in the browser.
The result would state an error of a missing twig file, which is described in the next step (Step 3).

#### Step 3 - Syncing Muban component to Drupal theme folder
Now is the right time to sync the component from muban frontend folder to drupal theme folder.
Let's assume that you have your custom theme ready under:

```
+ themes/custom/mycustomtheme_theme
```

Right there would be nice to create the following nested directories:

```
+ themes/custom/mycustomtheme_theme/components/[component-name]
```

In our case it will be looking like this:
```
+ themes/custom/mycustomtheme_theme/components/c01-hero
```
** In Muban `source/frontend/src/app/component/block` you need to copy your `c01-hero` (`data.yml`, `c01-hero.hbs`) files into your newly Drupal created component folder.

Finally your drupal theme structure will look like this:
```
+ themes/custom/mycustomtheme_theme/components/c01-hero
  +++ data.yml
  +++ c01-hero.twig.html
  +++ c01-hero.hbs 
```

#### Step 4 - Bridging handlebars throw twig.

As you can notice, the `component-name.twig.html` was created by us based on the component machine name. Now is the right time to edit this file and include the `.hbs` file into it:

```twig
c01-hero.twig.html

{{ handlebars('c01-hero.hbs', data) }}

```
As you can see, the inclusion is done through the `handlebars()` method, where the first argument is the hbs template from same directory, and `data` is the render array from Step 2 (`$variables['data']`)
and then `c01-hero.hbs` converts nested data array into variables and prints them inside of the html.

The final step would be to drop drupal cache and see the result in browser after this.
```sh
drush cr
```

#### Step 5: Update the assets (css/js).
Let's assume your muban project is in the`source/frontend` folder, from the root folder execute
```
yarn build

```
This will trigger muban to compile all the styles and typescript from each component folder into compressed `css`, `js` files.'
All these files you can find under the `build` directory which is created after full execution of `yarn build` command.

Now copy all the contents of this folder into your drupal theme `assets` folder. 
We also assume that you already connected the css and js through `libraries.yml` and the theme is marked as active.
