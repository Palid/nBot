module.exports = function(grunt) {

  grunt.initConfig({
  	watch: {
  	  scripts: {
  	    files: ['**/*.js', '!**/node_modules/**'],
  	    tasks: ['nodemon'],
  	    options: {
          debounceDelay: 10000,
          interval : 100,
  	      spawn: false

  	    }
  	  }
  	},
  	nodemon: {
  	  dev: {
  	    script: 'bot.js'
  	  }
  	}
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['nodemon', 'watch']);

};