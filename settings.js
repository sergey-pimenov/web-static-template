module.exports = {
  //*** I18n ***//
  localesDir : 'locales',
  locales : ['en'],
  defaultLang : 'en',
  delimeters: ['@{', '}'], // Compatible with Handlebars, Pug and Nunjucks

  //*** Structure, change free ***//
	src : './src',
	dist : './dist',

  ///*** Retina ***///
  /*
    Install:
    https://www.imagemagick.org/script/download.php
    before set hdpi : true or hdpiTotal : true
  */
  hdpi : false,
  hdpiTotal : false,

  //*** Image optimize ***//
  imagesOptimize : {
    lossless : false, // Set "lossless : false" to lossy сonversion

    jpg : {
      progressive : true,
      lossyQuality : 80
    },

    gif : {
      interlaced : true,
      lossyQuality : 80
    },

    png : {
      lossyQuality : 80
    },

    svgo : { // All plugins for SVGO - https://github.com/svg/svgo
      plugins: [
        { removeViewBox : true },
        { cleanupIDs : false }
      ]
    }
  }
};