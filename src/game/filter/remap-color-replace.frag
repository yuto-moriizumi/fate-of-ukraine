varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D colorMap;

void main(void)
{
    vec4 indexColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texture2D(colorMap, indexColor.rg * 255.0 / 256.0 + vec2(0.001953125, 0.001953125));
}