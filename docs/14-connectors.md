# Connectors

While talking about connectors, we assume that the technology that a platform is built in is using a CMS or a Framework, such as Drupal, Wordpress or any other.

The list of connectors/modules is listed below:

Drupal Handlebars for Drupal 8 - https://github.com/mediamonks/drupal-handlebars.git


## Drupal 8
### Installation

In order to perform Muban integration with Drupal first of all you will need to install Drupal Handlebars module.
In your project <b>composer.json</b> include the repository

```
"repositories": [
  {
     "type": "git",
     "url": "https://github.com/mediamonks/drupal-handlebars.git"
  },
  ...
  ]
```

Than execute:

```
 composer require "drupal/handlebars_theme_handler:1.6"
```

If you use drush you can enable the module following way:
```
 drush en handlebars_theme_handler -y
```

### Helper functions

Create a custom module let's call it mymodule_components, define .module and info.yml files.
Inside your custom module create a src/Handlebars/Helpers folder where you will place following 2 files:

+ src/Handlebars/Helpers/ConditionHelper.php

```
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

```
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

### Creating preprocessors.
There are 3 initial steps while working with handlebars:

+ Step 1: Create entities in Drupal eg. Paragraphs, Menus, Nodes.
+ Step 2: Create preprocessor that matches data.yml structure of the component.
+ Step 3: Sync muban component to Drupal theme folder.
+ Step 4: Bridge the twig to handlebars, through handlebars include function.
+ Step 5: Update the assets (css/js).

#### Step 1 - Creating entities.
On step 1 we assume that you use Paragraphs Drupal Module (https://www.drupal.org/project/paragraphs) in order to buid your components.
Let's assume that you already created a paragraph (paragraph machine name: c01_hero) that contains:

+ Title [field_title] [textfield]
+ Body  [field_body] [textarea]
+ Image [field_image] [image]

#### Step 2 - Creating preprocessor
Now having the paragraph created, we can create a preprocessor - is needed to aggregate data and pass it to theming layer in our case this is handlebars.
As a result our preprocessor should return an array or a nested array that will be converted in variables inside of hbs template.
Let's take a look at the data.yml file of the component that our front-end prepared:

+ data.yaml
```
title: 'Title goes here'
body: 'some longer text description'
image:
  src: 'hero/image-small.jpg'
  alt: 'alt text'
```

As you can see this is the pattern that our preprocessor needs to return. The data.yaml file is used to mock variables and texts,
so one Muban is compiled and you access Muban preview, you exactly see these texts.
What we gonna do now, we will create a preprocessor that takes data from paragraph fields and returns it in same format as in provided data.yaml file.

+ First of all we need to create following folders inside of our custom module 'mymodule_components':
+ src/Plugin/ThemeEntityProcessor/[EntityType] - EntityType can be Paragraph, Node, Media etc... 

In our case it will be a preprocessor for paragraph src/Plugin/ThemeEntityProcessor/ParagraphsBlock
Inside of this folder, we will create a PHP Class that will match the name of our c01_hero component.

+ src/Plugin/ThemeEntityProcessor/ParagraphC01Hero.php

and the contents of file will look like this: 
```
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
+ id - this is an id of the preprocessor, usually we keep it as [machineName]_[viewMode], it should be unique.
+ label - human readable label
+ entity_type - in our case is paragraph
+ bundle - is machine name of the entity, in our case c01_hero
+ view_mode - the view mode for which we create preprocessor, in our case is default. In future you can create more view modes for entities and create a separate preprocessor per view mode.

The annotation is automatically decoded by ThemeEntityProcessor and used further.
Also you can note that the main class is matching the file name and it extends the ThemeEntityProcessorBase, this is a requirement.
Is not excluded that you can create an intermediate class MyModuleIntermediateBase extends ThemeEntitiyProcessorBase in case you prefer to change something in the middle, here you use the power of OOP and Dependency Injection.

The final point is that your class should implement <b>preprocessItemData</b> function.
<br> Now let's take a closer look how to retrieve the filed data.

+ By annotation preprocessor knows what type of paragraph it is.
+ ThemeEntityProcessorBase provides some key methods that allows to retrieve the field data in a generic way, so you don't have to parse all nested arrays and objects for image fields, text fields etc. It does all for you!
+ You simply call:

```
$this->themeFieldProcessorManager->getFieldData($variables['elements']['field_title'])
```

Where field_title, is substituted with a machine name of the field you want to retrieve.
The output will vary based on the field widget, let's check some examples:

+ Textfield

```
$text = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_title'])

echo $text; // Output: 'Some text'

```

+ Imagefield
```
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
```
$link = $this->themeFieldProcessorManager->getFieldData($variables['elements']['field_link'])

var_dump($image); // 
Output array: 
[
 'url' => 'http://google.com'
 'label' => 'Click Here'
]
```

The last step we need to build a render array, meaning that inside of $variables['data'] you need to mimic same structure as in data.yml,
with exact same namings of array keys / aka variables.

```
 $variables['data'] = [
      'title' => $image,
      'body' => $body,
      'image' => [
        'src' => $image['image']['src'], 
        'alt' => $image['image']['alt']
        ]
    ];
```

This is the last step for creating preprocessor.

Bonus content: 
Below we will show some extra tweaks that might be useful while working with <b>getFieldData</b> method.


+ Retrieving multivalue field contents.
```
$this->themeFieldProcessorManager->getFieldData($variables['elements']['field_reviews'], ['multiple' => TRUE])
```
As you can notice the second argument for getFieldData are options, in upper case we use multiple => true to tell that this is a multivalue field,
the result output does not change, the only thing is that it will return a key based array.

+ Returning image with image styles.

```
$this->themeFieldProcessorManager->getFieldData($variables['elements']['field_image'], [
   'style' => [
      'mobile' => 'image_banner_small',
      'desktop' => 'image_banner',
    ],
  ]),
```

In order to retrieve an image in some predefined styles, a style key can be passed with machine names of image styles for conversion.

After you are done with preprocessor it is recommended to drop the drupal cache

```
drush cr
```

You can create a demo page with the paragraph component on it and see the result in browser.
The result would state an error of a missing twig file that is described in the next step (Step 3).

#### Step 3 - Syncing Muban component to Drupal theme folder.
Now is the right time to sync the component from muban frontend folder to drupal theme folder.
Let's assume that you have your custom theme ready under:

```
+ themes/custom/mycustomtheme_theme
```

Right there would be nice to create following nested directories:

```
+ themes/custom/mycustomtheme_theme/components/[component-name]
```

In our case it gonna look like this:
```
+ themes/custom/mycustomtheme_theme/components/c01-hero
```
** In Muban source/frontend/src/app/component/block you need to copy your c01-hero (data.yml, c01-hero.hbs) files into your newly Drupal created component folder.

<br><br>Finally your drupal theme structure will look like this:
```
+ themes/custom/mycustomtheme_theme/components/c01-hero
  +++ data.yml
  +++ c01-hero.twig.html
  +++ c01-hero.hbs 
```

As far you can notice the twig.html was created by us based on component machine name, now is the right time to edit this file and include .hbs file into it:

```
c01-hero.twig.html

{{ handlebars('c01-hero.hbs', data) }}

```
As far you can see the inclusion is done through handlebars() method, where first argument is the hbs template from same directory and data is the render array from Step 2 ($variables['data'])
and than c01-hero.hbs converts nested data array into variables and prints inside of html.

The final step would be to drop drupal cache and see the result in browser after this.
```
drush cr
```