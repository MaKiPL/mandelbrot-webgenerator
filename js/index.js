/**
 * Mandelbrot set using webgl
 */

var iterations = ITERS;
var scale = SCALE;
var offset = OFFSET;
var cReal = C_REAL;
var cImag = C_IMAG;
var red;
var green;
var blue;
var time = 0.0;
var timePlace = document.getElementById("time");

// Constants
function reset(_is_mandelbrot) {
  iterations = ITERS;
  scale = SCALE;
  offset = OFFSET;
  cReal = C_REAL;
  cImag = C_IMAG;
  red = RED;
  green = GREEN;
  blue = BLUE;
}
reset(true);

const aspect_ratio = 1.5;
var canvas = document.createElement("canvas");
canvas.setAttribute("id", "canvas");
canvas.height = window.innerHeight / 1.1;
canvas.width = canvas.height * aspect_ratio;

var canvasContainer = document.getElementById("canvas-container");
canvasContainer.appendChild(canvas);

var gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });

// Clear
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Compile shaders
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderText);
gl.compileShader(vertexShader);

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fractalFragmentShaderText);
gl.compileShader(fragmentShader);

// Attach shaders
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Vertices and indices for the quad
var quadVerts = new Float32Array([
  -1,
  -1, // bottom left corner
  -1,
  1, // top left corner
  1,
  1, // top right corner
  1,
  -1, // bottom right corner
]);

var quadIndices = [
  0,
  1,
  2, // first triangle
  0,
  2,
  3, // second triangle
];

// Verts
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

// indices
var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(quadIndices),
  gl.STATIC_DRAW
);

// Color
gl.useProgram(program);
/*
program.color = gl.getUniformLocation(program, "color");
gl.uniform4fv(program.color, tintColor);
 */

// Position
program.position = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(program.position);
gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

// Uniforms
var timeUniformLocation = gl.getUniformLocation(program, "time");
var iterationUniformLocation = gl.getUniformLocation(program, "iters");
var scaleUniformLocation = gl.getUniformLocation(program, "scale");
var offsetUniformLocation = gl.getUniformLocation(program, "offset");

var redLocation = gl.getUniformLocation(program, "red");
var greenLocation = gl.getUniformLocation(program, "green");
var blueLocation = gl.getUniformLocation(program, "blue");


var cRealUniformLocation = gl.getUniformLocation(program, "c_real");
var cImagUniformLocation = gl.getUniformLocation(program, "c_imag");

function setUniforms() {
  gl.uniform1f(iterationUniformLocation, iterations);
  gl.uniform1f(scaleUniformLocation, scale);
  gl.uniform2fv(offsetUniformLocation, offset);
  gl.uniform1f(cRealUniformLocation, cReal);
  gl.uniform1f(cImagUniformLocation, cImag);
  gl.uniform3fv(redLocation, red);
  gl.uniform3fv(greenLocation, green);
  gl.uniform3fv(blueLocation, blue);
}

function updateValues() { }

var prev_time;
var elapsed_frames = 0;
var prev_fps = 60.0;
var fpsElem = document.getElementById("fps");
var resElement = document.getElementById("res");
resElement.innerHTML = "res: " + canvas.width + "x" + canvas.height;
function animate(t) {
  if (prev_time === undefined) {
    prev_time = t;
  }
  const delta = t - prev_time;
  var fps = 1000.0 / delta;
  prev_time = t;

  elapsed_frames += 1;
  if (elapsed_frames % 10 == 0) {
    fpsElem.innerHTML = "fps: " + parseInt(fps);
    elapsed_frames = elapsed_frames % 100;
  }

  gl.uniform1f(timeUniformLocation, t / 1000);
  timePlace.innerHTML = "time: " + (t / 1000).toFixed(2);
  gl.clear(gl.COLOR_BUFFER_BIT);

  updateValues();
  setUniforms();

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(animate);
}
animate();
