const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

const { cleanupTemplate } = require('./webpack.helpers');

module.exports = ({ config, isDevelopment, buildType, isPartials }) => webpackConfig => {
  if (isPartials) {
    // partials don't need plugins
    return webpackConfig;
  }

  const plugins = [
      new webpack.DefinePlugin({
        'process.env': config.env[buildType],
      }),
  ];

  if (isDevelopment) {
    /*
     * ------------------------------------------------
     * Development-only plugins
     * ------------------------------------------------
     */
    plugins.push(
      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
    );
  } else {
    /*
     * ------------------------------------------------
     * Production-only plugins
     * ------------------------------------------------
     */
    plugins.push(
      new webpack.NamedChunksPlugin(),

      new MiniCssExtractPlugin({
        filename: 'asset/[name].css',
        allChunks : true,
      }),

      new CopyWebpackPlugin([
        {
          // copy files to public root (not versioned)
          context: config.staticPath,
          from: '**/*',
          to: config.buildPath,
        },
        {
          // copy over hbs templates and remove muban-specific imports and partial paths
          context: path.resolve(config.projectRoot, 'src/app/component'),
          from: '**/*.hbs',
          to: path.resolve(config.distPath, 'templates') + '/[path]/[name].hbs',
          toType: 'template',
          transform (content) {
            return cleanupTemplate(content.toString('utf8'))
          },
        },
        // {
        //   // add support for TWIG/HBS drupal integration, generates a twig file that includes a hbs partial
        //   context: path.resolve(config.projectRoot, 'src/app/component'),
        //   from: '**/*.hbs',
        //   to: path.resolve(config.distPath, 'templates') + '/[path]/[name].html.twig',
        //   toType: 'template',
        //   transform (content, path) {
        //     return `{{ handlebars('${path.split(/[/\\]/gi).pop()}', data) }}`;
        //   },
        // },
        // CONVERT HBS TEMPLATES
        (config.convertTemplates && config.convertTemplates.convertTo ? {
          // convert hbs to htl templates
          context: path.resolve(config.projectRoot, 'src/app/component'),
          from: '**/*.hbs',
          to: path.resolve(config.distPath, 'templates') + '/[path]/[name].' + config.convertTemplates.extension,
          toType: 'template',
          transform (content, path) {
            // convert to target template
            try {
              return convert(cleanupTemplate(content.toString('utf8')), config.convertTemplates.convertTo);
            } catch (e) {
              console.log(`failed converting "${path}"`);
              console.log(e);
              throw e;
            }
          },
        } : null),
        {
          // copy over component json
          context: path.resolve(config.projectRoot, 'src/app/component'),
          from: '**/*.{yaml,json}',
          to: path.resolve(config.distPath, 'templates'),
        },
        {
          // copy over data json
          context: path.resolve(config.projectRoot, 'src/data'),
          from: '**/*.{yaml,json}',
          to: path.resolve(config.distPath, 'data'),
        },
        {
          // copy over readme
          context: path.resolve(config.projectRoot, 'docs'),
          from: 'dist-implementation-guide.md',
          to: path.resolve(config.distPath),
        },
      ].filter(_ => _)),
    );

    // These are not on for a development build
    if (buildType === config.buildTypes.PRODUCTION) {
      plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
          generateStatsFile: true,
          statsFilename: path.resolve(config.distPath, 'bundlesize-profile.json'),
        }),
        new ImageminPlugin({
          disable: !config.dist.enableImageOptimization,
          svgo: null,
          gifsicle: null,
          jpegtran: null,
          optipng: !config.dist.enablePNGQuant ? { optimizationLevel: 3 } : null,
          pngquant: config.dist.enablePNGQuant ? { quality: '65' } : null,
          plugins: [
            imageminMozjpeg({
              quality: 85,
              progressive: true
            })
          ],
        }),
      );
    }
  }

  return ({
    ...webpackConfig,
    plugins,
  });
};
