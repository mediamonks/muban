# Webpack

TODO

* dev
* dist
  * partials
  * js and css
  * assets
  * comments
* standalone

## publicPath

The publicPath is the location your assets are retrieved from. The default is set to `/`. When you
deploy your site into a nested folder, you want to change the publicPath to that folder. This can be
done by passing the `--publicPath` flag:

```
yarn build --publicPath=/nested/folder/
yarn storybook:build --publicPath=/nested/folder/
```

When you don't know the publicPath during build time, you can also set it at runtime by setting the
`webpackPublicPath` variable on the window before any script file is loaded:

```
<script>
  window.webpackPublicPath = '/nested/folder/';
  // or
  window.webpackPublicPath = 'https://cdn-domain.site.com/nested/folder/';
</script>
```
