varying vec2 vUv;
varying vec4 vTextureCoords;
uniform sampler2D uAtlas;
uniform float uSplitProgress;
uniform float uFadeOut; // Uniform fade for all pages during transition

varying float vIndex;
varying float vRotationProgress;


void main()
{            
                 
    // Get UV coordinates for this image from the uniform array
    float xStart = vTextureCoords.x;
    float xEnd = vTextureCoords.y;
    float yStart = vTextureCoords.z;
    float yEnd = vTextureCoords.w;

     vec2 atlasUV = vec2(
        mix(xStart, xEnd, vUv.x),
        mix(yStart, yEnd, 1.-vUv.y)
    );

    // Only discard pages during the initial animation, not in 4-page layout mode
    if(vRotationProgress==0. && vIndex!=0. && uSplitProgress < 1.0)
    {
        discard;
    }
    
    // Sample the texture
    vec4 color = texture2D(uAtlas, atlasUV);
    
    // Fade during split phase to keep only 6 middle pages
    if(uSplitProgress >= 0.5) {
        // Keep exactly 6 middle pages visible: 11, 12, 13, 14, 15, 16 (out of 29 total pages)
        bool isMiddlePage = (vIndex >= 11.0 && vIndex <= 16.0);
        
        if(!isMiddlePage) {
            // Fade happens during split phase, after rotation is complete
            float fadeProgress = clamp((uSplitProgress - 0.5) / 0.5, 0.0, 1.0); // Fade from 0.5 to 1.0 of uSplitProgress
            color.a *= (1.0 - fadeProgress);
        }
    }
    
    // Apply uniform fade to ALL pages when transitioning
    color.a *= (1.0 - uFadeOut);
    
    gl_FragColor = color;
}