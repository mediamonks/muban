const path = require("path");
const { getBabelLoaderConfig } = require('./babel');

function getCodeRules() {
  return [
    {
      test: /\.js$/,
      include: [
        /src[\/\\]app/,
        /src[\/\\]storybook/,
      ],
      use: [
        {
          loader: 'cache-loader'
        },
        getBabelLoaderConfig()
      ]
    },
    {
      test: /\.ts$/,
      include: [
        /src[\/\\]app/,
        /src[\/\\]storybook/,
      ],
      use: [
        {
          loader: 'cache-loader'
        },
        getBabelLoaderConfig(),
        {
          loader: 'awesome-typescript-loader',
          options: {
            silent: true
          }
        }
      ]
    },
  ]
}

module.exports = {
  getCodeRules,
};
