module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-mixins'),
    require("postcss-combine-media-query"),
  ],
};
