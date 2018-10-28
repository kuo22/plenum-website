module.exports = {
  lintOnSave: false,
  configureWebpack: {
      resolve: {
          alias: {
              styles: path.resolve(__dirname, 'styles') // relative to the location of the webpack config file!
          }
      }
  }
};