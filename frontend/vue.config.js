module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    disableHostCheck: true, 
    port: 8081,
    watchOptions: {
      poll: true,
    },
  },
}
