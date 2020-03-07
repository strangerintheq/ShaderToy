# ShaderToy


new ShaderToy(`
    void main(void) {
        vec2 uv = gl_FragCoord.xy/resolution - 0.5;
        uv.x *= resolution.x/resolution.y;
        gl_FragColor = vec4(uv, sin(time), 1.);
    }
`).fullscreen().loop();
