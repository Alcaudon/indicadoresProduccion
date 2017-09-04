var gulp = require ("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var notify = require("gulp-notify");
var gulpImport = require("gulp-html-import");
var tap = require("gulp-tap");
var browserify = require("browserify");
var buffer = require("gulp-buffer");
var sourcemaps = require("gulp-sourcemaps");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var imagemin = require("gulp-imagemin");
var responsive = require("gulp-responsive");
const cpy = require('cpy');


gulp.task("default",["video","fonts","img","img-responsive","img-responsive-article","html","sass", "js"], function(){
    browserSync.init({ proxy: "http://127.0.0.1:3100/"});

    gulp.watch(["src/scss/*.scss","src/scss/**/*.scss"],["sass"]);    
    gulp.watch(["src/*.html", "src/**/*.html"], ["html"]);
    gulp.watch(["src/js/*.js", "src/js/**/*.js"], ["js"]);
})

gulp.task("sass", function(){
    gulp.src("src/scss/style.scss")
        .pipe(sourcemaps.init()) // comienza a capturar los sourcemaps
        .pipe(sass().on("error", function(error){
           return notify().write(error);
        }))
        .pipe(postcss([
            autoprefixer(), // transforma el CSS dándole compatibilidad a versiones antiguas
            cssnano()       // comprime/minifca el CSS
        ]))
        .pipe(sourcemaps.write("./")) // guarda el sourcemap en la misma carpeta que el CSS
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream());
})

gulp.task("html", function(){
    gulp.src("src/*.html")
        .pipe(gulpImport("src/components/"))
        .pipe(htmlmin({collapseWhitespace: true})) // minifica el HTML
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
})

gulp.task("js",["headroom"], function(){
    gulp.src("src/js/main.js")
        .pipe(tap(function(file){ // tap nos permite ejecutar una función por cada fichero seleccionado en gulp.src
            // reemplazamos el contenido del fichero por lo que nos devuelve browserify pasándole el fichero
            file.contents = browserify(file.path, {debug: true}) // creamos una instancia de browserify en base al archivo
                            .transform("babelify", {presets: ["es2015"]}) // traduce nuestro codigo de ES6 -> ES5
                            .bundle() // compilamos el archivo
                            .on("error", function(error){ // en caso de error, mostramos una notificación
                                return notify().write(error);
                            });
        }))
        .pipe(buffer()) // convertimos a buffer para que funcione el siguiente pipe
        .pipe(sourcemaps.init({loadMaps: true})) // captura los sourcemaps del archivo fuente
        .pipe(uglify()) // minificamos el JavaScript
        .pipe(sourcemaps.write('./')) // guarda los sourcemaps en el mismo directorio que el archivo fuente
        .pipe(gulp.dest("dist/js/")) // lo guardamos en la carpeta dist
        .pipe(browserSync.stream()) // recargamos el navegador
});

gulp.task("img-responsive", function(){
    gulp.src("src/img-responsive/*")
        .pipe(responsive({ // generamos las versiones responsive
            '*': [
                { width: 600, rename: { suffix: "-600px"}},
                { width: 690, rename: { suffix: "-690px"}},
            ]
        }))        
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img/"))
});

gulp.task("img-responsive-article", function(){
    gulp.src("src/img-responsive/article/*")
        .pipe(responsive({ // generamos las versiones responsive
            '*': [
                { width: 750, rename: { suffix: "-750px"}},
                { width: 1334, rename: { suffix: "-1334px"}},
                { width: 1536, rename: { suffix: "-1536px"}},
                { width: 1920, rename: { suffix: "-1920px"}},
            ]
        }))        
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img/"))
});

gulp.task("img", function(){
    cpy(['src/img/*'], 'dist/img').then(() => {
        console.log('Imagenes copiadas');
    });
});

gulp.task("fonts", function(){
    cpy(['src/resources/fonts/*'], 'dist/fonts').then(() => {
        console.log('fuentes copiadas');
    });
});

gulp.task("headroom", function(){
    cpy(['src/resources/*.js'], 'dist/js').then(() => {
        console.log('headroom copied');
    });
});

gulp.task("video", function(){
    cpy(['src/video/*'], 'dist/video').then(() => {
        console.log('headroom copied');
    });
});



