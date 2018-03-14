module.exports = function(grunt) {
	// Project configuration.
	// grunt-text-replace文本替换
	/*usermin 前端优化是尽量减少http请求，所以我们需要尽量合并压缩文件，
	然后调用压缩后的文件，比如多个css文件压缩成一个，多个js文件合并压缩等，usemin能够自动在html中使用压缩后的文件，达到上面的目的*/
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: { //任务
			scripts: { //自定义目标
				files: 'src/js/*.js',
				tasks: ['uglify'], //可以是任务名字:该属性 ()
				options: {
					livereload: true,
				},
			},
			css: {
				files: ['src/style/css/*.css'],
				tasks: ['default'],
				options: {
					livereload: false,
				},
			},
			html: {
				files: ['src/**.html'],
				tasks: ['default'],
				options: {
					livereload: false,
				},
			},
			less: {
				files: ['src/style/less/*.less'],
				tasks: ['less']
			},
			sass: {
				files: ['src/style/sass/*.scss'],
				tasks: ['sass']
			}
		},
		concat: {
			options: {
				separator: ';',
				stripBanners: true,
				banner: '/*!<%= pkg.author %> 最后合并于 <%= grunt.template.today("yyyy-mm-dd hh:mm:ss")%>\n */'
			},
			allJS: {
				src: ['cache/js/*.bundle.js'],//把缓存中的css文件合并到生产环境中去
				dest: 'dist/js/ay.bundle.js'
			},
			allCss:{
				options: {
					separator: ''
				},
				src: ['cache/css/*.bundle.css'],//把缓存中的js文件合并到生产环境中去
				dest: 'dist/css/ay.bundle.css'
			}
		},
		filerev: { //给生成的js文件重命名
			options: {
				algorithm: 'sha1',
				length: 8
			},
			js: {
				src: 'product/js/*.js'
			}
		},
		rev: {
			options: {
				algorithm: 'sha1',
				length: 8
			},
			assets: {
				files: [{
					src: [
						'product/style/*.css','product/style/css/*.css'
					]
				}]
			}
		},
		useminPrepare: {
			html: 'cache/html/*.html',
			options: {
				dest: 'cache'
			}
		},
		usemin: {
			html: 'cache/html/*.html',
			options: {
				dest: 'cache'
			},
			/*css : {
				files : [{
					src : ['product/style/!*.css','product/style/css/!*.css']
				}]
			},*/
			/*html: ['product/html/!*.html'], // 注意此处是build/*/
			css: ['product/style/!*.css','product/style/css/!*.css']
			/*options: {
				blockReplacements: {
					css: function (block) {
						return '<link rel="stylesheet" href="' +  block.dest + '">';
					}
				}
			}*/
		},
		cssmin: {
			options: {
				removeComments: true,
				collapseWhitespace:true,
				banner: '/*! <%= pkg.author %> <%= grunt.template.today("yyyy-MM-dd hh:mm:ss") %> */\n',
				footer: '\n/*! <%= pkg.author %> 最后修改于： <%= grunt.template.today("yyyy-MM-dd hh:mm:ss") %> */' //添加footer
			},
			target: {
				expand: true,
				cwd: 'src',
				src: ['css/*.css'],
				dest: 'cache',
				ext: '.bundle.css'
			}
		},
		uglify: { //js压缩
			options: { //通配置
				banner: '/*! <%= pkg.author %> <%= grunt.template.today("yyyy-MM-dd hh:mm:ss") %> */\n',
				footer: '\n/*! <%= pkg.author %> 最后修改于： <%= grunt.template.today("yyyy-MM-dd hh:mm:ss") %> */', //添加footer
				filter: function(filepath) { //过滤length == 0的js
					return(grunt.file.isDir(filepath) && require('fs').readdirSync(filepath).length === 0);
				},
				compress: {
					drop_console: false
				}
			},
			my_target: { //自定义的任务
				options: { //单独配置
					mangle: false,//不混淆变量名
					preserveComments: 'false'//true不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
				},
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['js/*.js'], //src: ['**/*.js','!**/backbone.js']匹配出了backbone.js的所有js文件
					dest: 'cache',
					ext: '.bundle.js'   // Dest filepaths will have this extension.
				}]
			}
		},
		jshint:{
			all:['src/js/*.js'],
			options:{
				globals: {
					jQuery: true,
					console: true,
					module: true
				},
				jshintrc:'.jshintrc'
			}
		},
		eslint: {
			options: {
				configFile: "eslint.json"
			},
			target: ["src/js/ayTools.js"]
		},
		clean: {//删除插件
			dist: {
				files: [{
					src: 'dist/'
				}]
			},
			cache:{
				files: [{
					src: 'cache/'
				}]
			}
		},
		copy:{
			image: {
			    files: [
			      //包括路径中的文件
			      //{expand: true, src: ['path/!*'], dest: 'dest/', filter: 'isFile'},
			      //包括路径中的文件和子目录
			      {expand: true, src: ['image/!**'], dest: 'product/image'}
			      //使得SRC相对于CWD所有
			      //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
			      //的结果为单级显示
			      //{expand: true, flatten: true, src: ['path/!**'], dest: 'dest/', filter: 'isFile',ext:''}
			    ]
			},
			static:{
				expand: true,
				cwd: 'src',
				src: ['lib/**','font/**'],
				dest: 'dist/'
			},
			html:{
				expand: true,
				cwd: 'src',
				src: ['html/*.compile.html'],
				dest: 'cache/'
			},
			cache:{
				expand: true,
				cwd: 'cache',
				src: ['**'],
				dest:'dist/'
			}
		},
		htmlmin: { //html压缩
			options: {
				removeComments: true,//去注释
				collapseWhitespace:true,//去换行
				removeCommentsFromCDATA:true,//删除<script>和<style>标签内的HTML注释
			},
			build: {
				expand: true,
				cwd: 'cache',
				src: ['html/*.compile.html'],
				dest: 'dist/',
				ext: '.bundle.html'
			}
		},
		imagemin: {
			/* 压缩图片大小 */
			dist: {
				options: {
					optimizationLevel: 3 //定义 PNG 图片优化水平
				},
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['image/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
						dest: 'dist/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
					}
				]
			}
		},
		less: {
			options: {
				removeComments: true,
				collapseWhitespace: true,
				compress: true
			},
			target: {
				expand: true,
				cwd: 'style/less',
				src: ['*.less'],
				dest: 'product/css',
				ext: '.css'
			}
		},
		compress:{
		  main:{
		    options: {
		      archive: '<%= pkg.name%>'+".zip"
		    },
		    files: [
		      {src: ['product/**']}
		    ]
		  }
		}
	});
	// 加载包含 "uglify" 任务的插件。
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	//grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-usemin');
	//grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	//grunt.loadNpmTasks('grunt-contrib-less');
	//grunt.loadNpmTasks('grunt-contrib-compress');
	//grunt.loadNpmTasks('grunt-rev');
	//grunt.loadNpmTasks('grunt-contrib-watch');
	//默认被执行的任务列表。
	//clean:html
	grunt.registerTask('default', ['clean','copy:lib','useminPrepare','uglify','imagemin','cssmin','htmlmin','rev','usemin']);
	//grunt.registerTask('default', ['clean','cssmin','htmlmin','copy']);
	grunt.registerTask('yasuo','压缩文件为zip包',function(){
		grunt.task.run('compress');
	});
	grunt.registerTask('build',['clean:dist','copy:html','uglify','cssmin','useminPrepare','concat','usemin','copy:static','htmlmin']);
	grunt.registerTask('watch', ['watch']);
};