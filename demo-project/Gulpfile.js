var gulp = require('gulp');
var gutil = require("gulp-util"),
	webpack = require("webpack"),
	path = require('path');

var config = {
	cache: true,
	entry: {
		demo: './Demo.js'
	},
	node: {
		fs: "empty"
	},
	output: {
		path: './',
		filename: 'Demo.min.js',
		publicPath: 'js/'
	},
	module: { },
	plugins: [
		new webpack.optimize.UglifyJsPlugin( )
	]
};

gulp.task('buildWebpack', function( callback ) {
	webpack( config, function(err, stats) {
		if(err){
			throw new gutil.PluginError("webpack", err);
		}
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		callback();
	});
});

gulp.task( 'default', [ 'buildWebpack' ] );
