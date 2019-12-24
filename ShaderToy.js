function ShaderToy(shader, config) {

  config = config || {};
  let c = config.target || document.createElement('canvas');
  !config.target && document.body.append(c);        
  let gl = c.getContext("webgl"); 
  let pid = gl.createProgram();
  let tmp = [];
  
  let triangle = new Float32Array([-1, 3, -1, -1, 3, -1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);
  
  let uniforms = config.uniforms || {};
  uniforms.time = '1f'
  uniforms.resolution = '2f';
  
  ['attribute vec2 v;void main(void){gl_Position=vec4(v,0.,1.);}', 
   'precision highp float;\n' + Object.keys(uniforms).map(uf => {
      let type = uniforms[uf][0];
      return `uniform ${type - 1 ? 'vec' + type : 'float'} ${uf};`;
  }).join('\n') + shader].forEach((src, i) => {
      let id = gl.createShader(i ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);
      gl.shaderSource(id, src);
      gl.compileShader(id);
      var message = gl.getShaderInfoLog(id);
      gl.attachShader(pid, id);
      if (message.length > 0) {
        console.log(src.split('\n').map((str, i) => 
           ("" + (1 + i)).padStart(4, "0") + ": " + str).join('\n'));
        throw message;
      }
  });
  gl.linkProgram(pid);
  gl.useProgram(pid);
  
  Object.keys(uniforms).forEach(uf => {
     let location = gl.getUniformLocation(pid, uf); 
     let func = gl[`uniform${uniforms[uf]}`];
     uniforms[uf] = v => func.call(gl, location, ...v);
  });
  
  let vertices = gl.getAttribLocation(pid, "v")
  gl.vertexAttribPointer(vertices, 2, gl.FLOAT, 0, 0, 0);
  gl.enableVertexAttribArray(vertices);

  this.draw = t => {
      tmp[0] = t;
      uniforms.time(tmp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  this.resize = (w, h) => {
      uniforms.resolution([c.width = w, c.height = h]);
      gl.viewport(0, 0, w, h);
  };
}
