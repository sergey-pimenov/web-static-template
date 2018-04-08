var settings = require('./settings.js');


var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    handlebars = require('gulp-compile-handlebars'),
    nunjucksRender = require('gulp-nunjucks-render'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    stylus = require('gulp-stylus'),
    pathLess = require('path');
    rename = require('gulp-rename'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    ts = require("gulp-typescript"),
    flatten = require('gulp-flatten'),
    checkFilesExist = require('check-files-exist'),
    i18n = require('gulp-i18n-localize'),
    webp = require('gulp-webp'),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    tsify = require("tsify"),
    imageminWebp = require('imagemin-webp'),
    imageResize = require('gulp-image-resize'),
    browserSync = require('browser-sync').create();

///// Production /////
var uglify = require('gulp-uglify'),
    pump = require('pump'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminMozjpeg = require('imagemin-mozjpeg');


///// Assemble all handlebars partials  //////
gulp.task('assemblePartials', () => {
  return gulp.src([
                    settings.src + '/components/**/*.handlebars', 
                    settings.src + '/basic/**/*.handlebars'
                   ])
    .pipe(flatten())
    .pipe(gulp.dest('.tmp/partials'))
});


///// Compile handlebars /////
gulp.task('compileHandlebars', ['assemblePartials'], () => {
  return gulp.src([settings.src + '/pages/*.handlebars'])
    .pipe(handlebars({},{
      batch : ['.tmp/partials']
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest('.tmp/compiled'));
});


///// Assemble all nunjucks partials  //////
gulp.task('assembleNunjucksPartials', () => {
  return gulp.src([
                    settings.src + '/components/**/*.html', 
                    settings.src + '/basic/**/*.html'
                   ])
    .pipe(flatten())
    .pipe(gulp.dest('.tmp/partials'))
});



gulp.task('compileNunjucks', ['assembleNunjucksPartials'], function () {
  return gulp.src(settings.src + '/*.html')
    .pipe(nunjucksRender({
      path: ['.tmp/partials']
    }))
    .pipe(gulp.dest('.tmp/compiled'));
});


///// Compile Pug /////
gulp.task('compilePug', () => {
  return gulp.src([settings.src + '/pages/*.pug'])
    .pipe(pug())
    .pipe(gulp.dest('.tmp/compiled'));
});


///// I18n //////
gulp.task('i18n', ['compileHandlebars', 'compilePug', 'compileNunjucks'], () => {
  return gulp.src('.tmp/compiled/**/*.html')
    .pipe(i18n({
      locales: settings.locales,
      localeDir: settings.localesDir,
      delimeters: settings.delimeters
    }))
    .pipe(gulp.dest('.tmp/i18n'));
});


///// Transfer default language HTML to dist /////
gulp.task('transferDefaultLang', ['i18n'], () => {
  return gulp.src('.tmp/i18n/' + settings.defaultLang + '**/*.html')
    .pipe(flatten())
    .pipe(gulp.dest(settings.dist))
    .pipe(browserSync.reload({
      stream: true
    }))
  }
);


///// Transfer othe languages HTML to dist /////
gulp.task('transferOtherLangs', ['i18n'], () => {
  return gulp.src([
                    '.tmp/i18n/**/*.html', 
                    '!.tmp/i18n/' + settings.defaultLang + '**/*.html'
                  ])
    .pipe(gulp.dest(settings.dist))
    .pipe(browserSync.reload({
      stream: true
    }))
  }
);


///// Compile Sass /////
gulp.task('compileSass', () => {
  return gulp.src(settings.src + '/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(settings.dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Compile Critical Sass /////
gulp.task('compileCriticalSass', () => {
  return gulp.src(settings.src + '/critical/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(settings.dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Compile Less /////
gulp.task('compileLess', function () {
  return gulp.src(settings.src + '/index.less')
    .pipe(less({
      paths: [ pathLess.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(settings.dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Compile critical Less /////
gulp.task('compileCriticalLess', function () {
  return gulp.src(settings.src + '/critical/styles/*.less')
    .pipe(less({
      paths: [ pathLess.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(settings.dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Compile Stylus /////
gulp.task('compileStylus', function () {
  return gulp.src(settings.src + '/**.styl')
    .pipe(stylus())
    .pipe(gulp.dest(settings.dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Compile critical Stylus /////
gulp.task('compileCriticalStylus', function () {
  return gulp.src(settings.src + '/critical/styles/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(settings.dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


/// Compile JS /////
gulp.task('compileJS', () => {
    return gulp.src(settings.src + '/*.js')
    .pipe(webpackStream({
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ],
      },
      output: {
        filename: 'index.js',
      }
    }, webpack))
    .pipe(gulp.dest(settings.dist + '/scripts'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


/// Compile critical JS /////
gulp.task('compileCriticalJS', (CriticalComponentName) => {
  return gulp.src(settings.src + '/ctitical')
  .pipe(rename(function (path) {
    CriticalComponentName = path.basename;
  }))
  .pipe(webpackStream({
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ],
    },
    output: {
      filename: 'critical.js',
    }
  }, webpack))
  .pipe(gulp.dest(settings.dist + '/scripts'))
  .pipe(browserSync.reload({
    stream: true
  }))
});


///// Compile TS /////
gulp.task("compileTS", function () {
  checkFilesExist([settings.src + '/index.ts']).then(function () {
    return browserify({
      basedir: '.',
      debug: false,
      entries: [settings.src + '/index.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest(settings.dist + '/scripts'))
    .pipe(browserSync.reload({
      stream: true
    }))
  })
});


///// Compile critical TS /////
gulp.task("compileCriticalTS", function () {
  checkFilesExist([settings.src + '/critical/scripts/critical.ts']).then(function () {
    return browserify({
      basedir: '.',
      debug: false,
      entries: [settings.src + '/critical/scripts/critical.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('critical.js'))
    .pipe(gulp.dest(settings.dist + '/scripts'))
    .pipe(browserSync.reload({
      stream: true
    }))
  })
});


///// Live reload //////
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: settings.dist
    }
  })
});


///// Image transporter //////
gulp.task('imageTrans', () => {
  return gulp.src([settings.src + '/resources/images/**/*.{jpg,png,gif,webp,apng,svg}'])
    .pipe(flatten())
    .pipe(gulp.dest(settings.dist + '/images'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Unretina images in hdpi dist ///
gulp.task('unretinaHDPI', () => {
  return gulp.src(settings.src + '/resources/images/**/hdpi*/*.{jpg,png,gif,apng}')
    .pipe(gulpif(settings.hdpi, imageResize({
      imageMagick: true,
      interlace: true,
      quality: 1,
      percentage: 50
    })))
    .pipe(gulpif(settings.hdpi, rename((path) => {
      path.basename += "_0.5";
    })))
    .pipe(gulpif(settings.hdpi, flatten()))
    .pipe(gulpif(settings.hdpi, gulp.dest(settings.dist + '/images')))
    .pipe(gulpif(settings.hdpi, browserSync.reload({
      stream: true
    })));
});


///// Unretina all images ///
gulp.task('unretinaAll', () => {
  return gulp.src(settings.src + '/resources/images/**/*.{jpg,png,gif,apng}')
    .pipe(gulpif(settings.hdpiTotal, imageResize({
      imageMagick: true,
      interlace: true,
      quality : 1,
      percentage: 50
    })))
    .pipe(gulpif(settings.hdpiTotal, rename((path) => {
      path.basename += "_0.5";
    })))
    .pipe(gulpif(settings.hdpiTotal, flatten()))
    .pipe(gulpif(settings.hdpiTotal, gulp.dest(settings.dist + '/images')))
    .pipe(gulpif(settings.hdpiTotal, browserSync.reload({
      stream: true
    })));
});


///// Webp //////
gulp.task('webp', () =>
  gulp.src(settings.src + '/resources/images/**/webp*/**/*.{jpg,png,gif}')
    .pipe(gulpif(settings.imagesOptimize.lossless, webp({
      nearLossless: 100
    })))
    .pipe(gulpif(!settings.imagesOptimize.lossless, webp({
      quality: 80
    })))
    .pipe(flatten())
    .pipe(gulp.dest(settings.dist + '/images'))
);


///// Unretina hdpi webp /////
gulp.task('unretinaHDPIWebp', () => {
  gulp.src([
            settings.src + '/resources/images/**/webp*/**/hdpi*/**/*.{jpg,png,gif}',
            settings.src + '/resources/images/**/hdpi*/**/webp*/**/*.{jpg,png,gif}'
           ])
    .pipe(gulpif(settings.hdpi, imageResize({
      imageMagick: true,
      percentage: 50
    })))
    .pipe(gulpif(settings.imagesOptimize.lossless, webp({
      quality: 100
    })))
    .pipe(gulpif(!settings.imagesOptimize.lossless, webp({
      quality: 50
    })))
    .pipe(gulpif(settings.hdpi, rename((path) => {
      path.basename += "_0.5";
    })))
    .pipe(gulpif(settings.hdpi, flatten()))
    .pipe(gulpif(settings.hdpi, gulp.dest(settings.dist + '/images')));
  }
);


///// Unretina all webp /////
gulp.task('unretinaAllWebp', () => {
  gulp.src(settings.src + '/resources/images/**/webp*/**/*.{jpg,png,gif}')
    .pipe(gulpif(settings.hdpiTotal, imageResize({
      imageMagick: true,
      percentage: 50
    })))
    .pipe(gulpif(settings.imagesOptimize.lossless, webp({
      quality: 100
    })))
    .pipe(gulpif(!settings.imagesOptimize.lossless, webp({
      quality: 50
    })))
    .pipe(gulpif(settings.hdpiTotal, rename((path) => {
      path.basename += "_0.5";
    })))
    .pipe(gulpif(settings.hdpiTotal, flatten()))
    .pipe(gulpif(settings.hdpiTotal, gulp.dest(settings.dist + '/images')));
  }
);


// Common images task
gulp.task('imagesTask', () => {
  gulp.start('imageTrans');
  gulp.start('unretinaAll');
  gulp.start('unretinaHDPI');
  gulp.start('webp');
  gulp.start('unretinaHDPIWebp');
  gulp.start('unretinaAllWebp');
});


///// Fonts transporter //////
gulp.task('fontsTrans', () => {
  return gulp.src([settings.src + '/resources/fonts/**/*.{eot,woff2,woff,ttf,svg}'])
    .pipe(flatten())
    .pipe(gulp.dest(settings.dist + '/fonts'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


///// Minify JS /////
gulp.task('MinifyJS', (cb) => {
  pump([
        gulp.src(settings.dist + '/scripts/**/*.js'),
        uglify(),
        gulp.dest(settings.dist + '/scripts')
    ],
    cb
  );
});


///// Minify CSS /////
gulp.task('minifyCSS', () => {
  return gulp.src(settings.dist + '/styles/**/*.css')
    .pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest(settings.dist + '/styles'));
});


///// Set prefixes /////
gulp.task('setPrefixes', ['minifyCSS'], () => { // Run only after minifying finishing
  return gulp.src(settings.dist + '/styles/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(settings.dist + '/styles'))
});


///// Minify HTML /////
gulp.task('minifyHTML', () => {
  return gulp.src(settings.dist + '/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(settings.dist));
});


///// lossless /////
gulp.task('imagesLossless', () =>
  gulp.src(settings.dist + '/images/*')
    .pipe(gulpif(settings.imagesOptimize.lossless, imagemin(
      [
        imagemin.gifsicle(settings.imagesOptimize.gif),
        imagemin.jpegtran(settings.imagesOptimize.jpg),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo(settings.imagesOptimize.svgo)
      ]
    )))
    .pipe(flatten())
    .pipe(gulp.dest(settings.dist + '/images/'))
);


///// Lossy /////
gulp.task('imagesLossy', () =>
  gulp.src(settings.dist + '/images/*')
    .pipe(gulpif(!settings.imagesOptimize.lossless, imagemin([
            imagemin.gifsicle({
              interlaced: true,
              optimizationLevel: 3
            }),
            imageminMozjpeg({
                progressive : settings.imagesOptimize.jpg.progressive,
                quality: settings.imagesOptimize.jpg.lossyQuality
            }),
            imageminPngquant({
              floyd: false,
              nofs: true,
              quality: settings.imagesOptimize.png.lossyQuality
            })
        ])))
    .pipe(flatten())
    .pipe(gulp.dest(settings.dist + '/images/'))
);


///// Watch /////
gulp.task('default', [
                      'imagesTask',
                      'browserSync',
                      'transferDefaultLang',
                      'transferOtherLangs',
                      'compileSass',
                      'compileLess',
                      'compileStylus',
                      'compileCriticalSass',
                      'compileCriticalLess',
                      'compileCriticalStylus',
                      'compileJS',
                      'compileTS',
                      'compileCriticalJS',
                      'compileCriticalTS',
                      'imageTrans',
                      'fontsTrans'
                      ],
  function() {
    gulp.watch([settings.src + '/**/*.scss', settings.src + '/*.scss'], 
               ['compileSass', 'compileCriticalSass']);

    gulp.watch([settings.src + '/**/*.less', settings.src + '/*.less'], 
               ['compileLess', 'compileCriticalLess']);

    gulp.watch([settings.src + '/**/*.styl', settings.src + '/*.styl'], 
               ['compileStylus', 'compileCriticalStylus']);

    gulp.watch(['!' + settings.src + '/resources/images/**/webp*',
                '!' + settings.src + '/resources/images/**/webp*/**/*',
                settings.src + '/resources/images/**/*.{jpg,png,gif,svg,webp}'], 
                ['imageTrans', 'unretinaAll', 'unretinaHDPI']);

    gulp.watch([settings.src + '/resources/images/**/webp*',
                settings.src + '/resources/images/**/webp*/**/*'], 
                ['webp', 'unretinaAllWebp', 'unretinaHDPIWebp']);

    gulp.watch([settings.src + '/**/*.js', settings.src + '/index.js'], 
               ['compileJS', 'compileCriticalJS']);

    gulp.watch([settings.src + '/**/*.ts', settings.src + '/index.ts'], 
               ['compileTS', 'compileCriticalTS']);

    gulp.watch([settings.src + '/**/*.{handlebars,pug,html}'], 
               ['transferDefaultLang', 'transferOtherLangs']);

    gulp.watch([settings.src + '/**/*.{eot,woff2,woff,ttf,svg}'], 
               ['fontsTrans']);
});


gulp.task('build', [
                    'imagesTask',
                    'transferDefaultLang',
                    'transferOtherLangs',
                    'compileSass',
                    'compileLess',
                    'compileStylus',
                    'compileCriticalSass',
                    'compileCriticalLess',
                    'compileCriticalStylus',
                    'compileJS',
                    'compileTS',
                    'compileCriticalJS',
                    'imageTrans',
                    'fontsTrans'
                  ]);


///// Production /////
gulp.task('prod', [
                    'imagesLossless',
                    'imagesLossy',
                    'MinifyJS',
                    'minifyCSS',
                    'minifyHTML',
                    'setPrefixes'
                  ]);