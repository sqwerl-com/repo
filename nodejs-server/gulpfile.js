require('babel-register')

const debug = require('gulp-debug')
const del = require('del')
const eslint = require('gulp-eslint')
const exec = require('child_process').exec
const gulp = require('gulp')
const gzip = require('gulp-zip')
const istanbul = require('gulp-istanbul')
const jasmine = require('gulp-jasmine')
const moment = require('moment')
const reporters = require('jasmine-reporters')
const run = require('gulp-run')

gulp.task('build', ['clean', 'lint:js'], function () {
})

gulp.task('clean', function (callback) {
  del(['./target/**'], callback)
})

gulp.task('default', ['clean', 'lint:js', 'test'], function () {
  gulp.start('deploy')
})

gulp.task('deploy', ['pack'], function () {
})

gulp.task('instrument', function () {
  return gulp.src('src/main/javascript/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
})

gulp.task('lint:js', function () {
  return gulp.src([
    'gulpfile.js',
    'src/main/javascript/*.js',
    'src/test/javascript/*.js'
  ]).pipe(debug())
    .pipe(eslint())
    .pipe(eslint.format())
})

gulp.task('pack', ['stage'], function () {
  var time = moment().format('MM-DD-YYYY')
  return gulp.src(['package.json', '**/*.js', '!debug/**', '!gulpfile.js', '!node_modules', '!node_modules/**', '!src/main/test/**', '!temp', '!temp/**', './third-party/**'])
    .pipe(gzip('sqwerl-nodejs-server-' + time + '.zip'))
    .pipe(gulp.dest('target'))
})

gulp.task('run', function (callback) {
  var serverCommand = new run.Command('node index.js ../resources/development_configuration.json', { cwd: 'src/main/javascript' })
  serverCommand.exec()
})

gulp.task('stage', function () {
  // TODO
})

gulp.task('test', ['instrument', 'test-tap'], function () {
})

gulp.task('test-jasmine', ['instrument'], function () {
  return gulp.src('src/test/javascript/*.spec.js')
    .pipe(jasmine({
      includeStackTrace: true,
      reporter: new reporters.JUnitXmlReporter({ savePath: 'target/reports/tests' }),
      verbose: true
    }))
    .pipe(istanbul.writeReports({
      reporters: ['cobertura', 'html', 'json'],
      reportOpts: { dir: 'target/reports/tests' }
    }))
  // TODO
  // .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 }}));
})

gulp.task('test-tap', ['instrument'], function () {
  exec('tap src/test/javascript/tap --coverage --coverage-report=cobertura --reporter xunit --no-browser', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
  })
  /*
   return gulp.src(['src/test/javascript/converter.js', 'src/test/javascript/database.js', 'src/test/javascript/email-validator.js', 'src/test/javascript/query-results-handler.js', 'src/test/javascript/resource.js', 'src/test/javascript/router.js', 'src/test/javascript/security.js', 'src/test/javascript/value-converter.js'])
    .pipe(tape({
      reporter: tapXunit()
    }))
    .pipe(process.stdout);
    .pipe(istanbul.writeReports({
      reporters: ['html', 'json'],
      reportOpts: { dir: 'target/reports/tests' }
    }));
    */
})
