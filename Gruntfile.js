
module.exports = function(grunt){
    grunt.initConfig({
        bower: {install: {options: {targetDir: './build/'}}},
        jshint: {all: ['Gruntfile.js', 'yotsuko.js', 'test/base.js', 
            'test/test.js']},
        uglify: {js: {files: {'build/yotsuko.min.js': ['yotsuko.js']}}},
    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['bower', 'jshint', 'uglify']);
};
