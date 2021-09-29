main();

//
// Aquí comienza
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // Revisa que exista el contexto para webgl

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader 

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader 

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Inicializa el shader program; esto es para toda la iluminación de los vertices

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  // Recopila toda la información necesaria para usar el programa de sombreado.
  // Busca los atributos que utiliza nuestro programa de sombreado para aVertexPosition, aVertexColor y también buscar ubicaciones uniformes.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Aquí se llama a la rutina que construye los objetos que serán dibujados.
  const buffers = initBuffers(gl);

  // dibuja la escena
  drawScene(gl, programInfo, buffers);
}

//
// initBuffers
//
// Inicialzia el buffer, para probar utilicé un cuadrado 
//
function initBuffers(gl) {

  // Crear un buffer para el cuadrado

  const positionBuffer = gl.createBuffer();

  // Se selecciona positionbuffer para aplicarle las operaciones

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // arreglo para las posiciones del cuadrado

  const positions = [
     1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
    -1.0, -1.0,
  ];

  // Se pasa la lista de posiciones a webgl para poder crear la forma.
  // se hace esto creando un Float32Array desde la matriz de JavaScript y con esto se llena un buffer actual.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // se colocan los colores para los vertices

  var colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

//
// se dibuja la escena
//
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Claro a negro, completamente opaco
  gl.clearDepth(1.0);                 // Limpiar todo
  gl.enable(gl.DEPTH_TEST);           // Habilitar la prueba de profundidad
  gl.depthFunc(gl.LEQUAL);            // Cosas cercanas oscurecen las cosas lejanas

  // se limpia el canvas antes de trabajar en él

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Crea una matriz de perspectiva, una matriz especial que es
  // utilizado para simular la distorsión de la perspectiva en una cámara.
  // Nuestro campo de visión es de 45 grados, con un ancho / alto
  // relación que coincide con el tamaño de visualización del lienzo
  // y solo queremos ver objetos entre 0,1 unidades
  // y a 100 unidades de la cámara.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

 // glmatrix.js siempre tiene el primer argumento como destino para recibir el resultado.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Establece la posición del dibujo en el punto "identidad", que es el centro de la escena.
  const modelViewMatrix = mat4.create();

  // Mueve la posición del dibujo un poco a donde empieza a dibujar el cuadrado.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  // Extraer las posiciones de la posición búfer en el atributo vertexPosition
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }


   //se le dice a WebGL cómo extraer los colores del búfer de color en el atributo vertexColor.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

 // hacer que webgl use nuestro programa para dibujar

  gl.useProgram(programInfo.program);

  // Setear los shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

//
// Inicizlizar un shader program, para que webgl sepa como dibujar nuestros datos
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // crear el shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // alerta por si el shader program falla

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// crear un shader del tipo dado, sube la fuente y lo compila.

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // manda la fuente al shader object

  gl.shaderSource(shader, source);

  // Compila el shader program

  gl.compileShader(shader);

  // checar si compiló exitosamente
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}