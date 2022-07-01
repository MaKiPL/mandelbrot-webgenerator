/*
Vertex and fragment shaders
*/

// Vertex shader
var vertexShaderText = `
attribute vec2 position;
varying vec4 _pos;

void main() {
  vec4 p = vec4(position, 0.0, 1.0);
  gl_Position = p;
  _pos = p;
}
`;


// Fractal Fragment shader
var fractalFragmentShaderText = `
precision highp float;
uniform float time;

uniform float iters;
uniform float scale;
uniform vec2 offset;
uniform float c_real;
uniform float c_imag;
uniform vec3 red;
uniform vec3 green;
uniform vec3 blue;

varying vec4 _pos;

const float limiter = 4.;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float map(float value, vec3 col, float max2) {
  return col.z + (value - col.x) * (max2 - col.z) / (col.y - col.x);
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float get_mandelbrot_set(float real, float img, float c_real, float c_imag, float iters) {
  float cr = real;
  float ci = img;

  real = c_real;
  img = c_imag;
  
  float fractal_color = 0.0;
  for(float i=0.0; i<2500.0; i++) {
    if(i >= iters) break;
    
    float real_prev = real;
    real = real_prev * real_prev - img * img + cr;
    img = 2.0 * real_prev * img + ci;

    if(real*real + img*img > limiter) {
        fractal_color = i / iters;
        break;
    }
  }

  return fractal_color;
}

void main() {
  float scale = 1.0 / scale;

  float real = (_pos[0]) * scale  + offset.x;
  float img = (_pos[1]) * scale + offset.y;

  float fractal_color = get_mandelbrot_set(real, img, c_real, c_imag, iters);

  float r = map(fractal_color, red, 1.0);
  float g = map(fractal_color, green, 1.0);
  float b = map(fractal_color, blue, 1.0);

  vec3 mandelbrot_color = vec3(r, g, b);
  
  vec4 final_color = vec4(mandelbrot_color, 1.0);
  final_color.a = 1.;
  gl_FragColor = final_color;
}
`;

