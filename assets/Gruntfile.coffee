proxy = require('proxy-middleware')
serveStatic = require('serve-static')
httpPlease = require('connect-http-please')
url = require('url')
middlewares = require('./speed-middleware')

module.exports = (grunt) ->
  pkg = grunt.file.readJSON('package.json')

  accountName = process.env.VTEX_ACCOUNT or pkg.accountName or 'basedevmkp'

  environment = process.env.VTEX_ENV or 'vtexcommercestable'

  verbose = grunt.option('verbose')

  imgProxyOptions = url.parse("http://#{accountName}.vteximg.com.br/arquivos")
  imgProxyOptions.route = '/arquivos'

  # portalHost is also used by connect-http-please
  # example: basedevmkp.vtexcommercestable.com.br
  portalHost = "#{accountName}.#{environment}.com.br"
  portalProxyOptions = url.parse("http://#{portalHost}/")
  portalProxyOptions.preserveHost = true

  config =
    clean:
      main: ['build']

    copy:
      main:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**', '!**/*.coffee', '!**/*.scss']
          dest: "build/"
        ]

    coffee:
      main:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.coffee']
          dest: "build/"
          ext: '.js'
        ]

    sass:
      compile:
        options:
          style: 'compressed'
          loadPath: require('node-neat').includePaths
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.scss']
          dest: 'build/'
          ext: '.css'
        ]

    cssmin:
      main:
        expand: true
        cwd: 'build/'
        src: ['*.css', '!*.min.css']
        dest: 'build/'
        ext: '.min.css'

    uglify:
      options:
        mangle: false
      main:
        files: [{
          expand: true
          cwd: 'build/'
          src: ['*.js', '!*.min.js']
          dest: 'build/'
          ext: '.min.js'
        }]

    connect:
      http:
        options:
          hostname: "*"
          livereload: true
          port: process.env.PORT || 80
          middleware: [
            middlewares.disableCompression
            middlewares.replaceHtmlBody(environment)
            httpPlease(host: portalHost, verbose: verbose)
            serveStatic('./build')
            proxy(imgProxyOptions)
            proxy(portalProxyOptions)
            middlewares.errorHandler
          ]

    watch:
      options:
        livereload: true
      sass:
        files: ['src/**/*.scss']
        tasks: ['sass']
      main:
        files: ['src/**/*.js', 'src/**/*.css']
        tasks: ['copy']

  tasks =
    # Building block tasks
    build: ['clean', 'copy:main', 'coffee', 'sass']
    min: ['uglify', 'cssmin'] # minifies files

    # Deploy tasks
    dist: ['build', 'min'] # Dist - minifies files
    test: []

    # Development tasks
    default: ['build', 'connect', 'watch']
    devmin: ['build', 'min',
             'connect:http:keepalive'] # Minifies files and serve

  # Project configuration.
  grunt.config.init config

  if grunt.cli.tasks[0] is 'sass'
    grunt.loadNpmTasks 'grunt-contrib-sass'

  else if grunt.cli.tasks[0] is 'coffee'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

  else
    grunt.loadNpmTasks name for name of pkg.devDependencies when name[0..5] is 'grunt-'
  grunt.registerTask taskName, taskArray for taskName, taskArray of tasks
